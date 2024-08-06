import  { useState, useEffect } from 'react';
import io from 'socket.io-client';

// Initialize socket connection
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

    // Listen for incoming messages
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Cleanup listeners on component unmount
    socket.emit('getHistory');
    socket.on('history', (history) => {
      setMessages(history);
    });

    // Cleanup listeners on component unmount
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
    <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md overflow-hidden">
  <div className="p-4">
    <h1 className="text-2xl font-bold mb-4 text-pink-600 text-center">Chat Directly</h1>
    <div className="h-96 overflow-y-auto mb-4 border border-pink-200 rounded-lg p-4 bg-pink-50">
      {messages.map((msg, index) => (
        <div key={index} className={`flex ${msg.isAdmin ? 'justify-start' : 'justify-end'} mb-4`}>
          <div className={`max-w-[80%] rounded-lg px-4 py-2 ${
            msg.isAdmin ? 'bg-white text-gray-800 border border-pink-300' : 'bg-pink-500 text-white '
          }`}>
            <div className='flex items-center gap-1'>
            <p className={`text-xs mt-1 ${msg.isAdmin ? 'text-gray-500' : 'text-pink-200'}`}>
              {msg.isAdmin ? 'Admin : ' : ''}
            </p>
            <p className="text-sm">{msg.message}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
    <div className="flex">
      <input
        className="flex-grow mr-2 px-4 py-2 border border-pink-300 rounded-lg focus:outline-none  outline-none"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        placeholder="Type your message..."
      />
      
    </div>
  </div>
</div>
  );
}

export default Messages;