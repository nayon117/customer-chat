import  { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000', { 
  query: { userId: localStorage.getItem('userId') || Math.random().toString(36).substring(7) }
});

function Messages() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('userId')) {
      localStorage.setItem('userId', Math.random().toString(36).substring(7));
    }

    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.emit('getHistory');
    socket.on('history', (history) => {
      setMessages(history);
    });

    return () => {
      socket.off('message');
      socket.off('history');
    };
  }, []);

  const sendMessage = () => {
    if (inputMessage.trim() !== '') {
      socket.emit('sendMessage', inputMessage);
      setInputMessage('');
    }
  };

  return (
    <div>
      <h1>User Chat</h1>
      <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px' }}>
        {messages.map((msg, index) => (
          <div key={index}>
            {msg.isAdmin ? 'Admin: ' : 'You: '}{msg.message}
          </div>
        ))}
      </div>
      <input
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Messages;