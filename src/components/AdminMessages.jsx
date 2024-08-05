import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:3000');

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    socket.on('new_message', (message) => {
      if (message.userId === currentUser) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    socket.on('admin_response', (response) => {
      if (response.userId === currentUser) {
        setMessages((prevMessages) => [...prevMessages, response]);
      }
    });

    return () => {
      socket.off('new_message');
      socket.off('admin_response');
    };
  }, [currentUser]);

  const fetchUserMessages = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/messages/${userId}`);
      setMessages(response.data);
      setCurrentUser(userId);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendAdminResponse = () => {
    if (input.trim() && currentUser) {
      socket.emit('admin_response', { content: input, userId: currentUser });
      setInput('');
    }
  };

  return (
    <div className="admin-chat-container p-4 bg-gray-100">
      <div className="user-list mb-4">
        {users.map((user) => (
          <button
            key={user.userId}
            onClick={() => fetchUserMessages(user.userId)}
            className="p-2 bg-gray-200 rounded-lg mb-2 w-full text-left"
          >
            {user.userId}
          </button>
        ))}
      </div>
      <div className="messages flex-1 overflow-y-auto p-2 border border-gray-300 bg-white rounded-lg">
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
      <div className="flex items-center space-x-2 mt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a response..."
          className="flex-1 p-2 border border-gray-300 rounded-lg"
        />
        <button
          onClick={sendAdminResponse}
          className="bg-blue-500 text-white p-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AdminMessages;
