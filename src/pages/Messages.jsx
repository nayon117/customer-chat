
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:3000');

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const id = socket.id; // Use socket ID as user ID
    setUserId(id);

    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/messages/${id}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    socket.on('new_message', (message) => {
      if (message.userId === id) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    socket.on('admin_response', (response) => {
      if (response.userId === id) {
        setMessages((prevMessages) => [...prevMessages, response]);
      }
    });

    return () => {
      socket.off('new_message');
      socket.off('admin_response');
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit('user_message', { content: input, userId });
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full p-4 bg-gray-100">
      <div className="flex-1 overflow-y-auto mb-4 p-2 border border-gray-300 bg-white rounded-lg">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 mb-2 rounded-lg ${
              msg.sender === 'user'
                ? 'bg-blue-200 text-right'
                : 'bg-gray-200 text-left'
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border border-gray-300 rounded-lg"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white p-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Messages;
