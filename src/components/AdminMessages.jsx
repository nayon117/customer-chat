import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

function AdminMessages() {
  const [socket, setSocket] = useState(null);
  const [users, setUsers] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      const newSocket = io('http://localhost:5000', {
        query: { userId: 'admin' },
        auth: { token: 'admin-token' }
      });

      setSocket(newSocket);

      newSocket.on('newMessage', (message) => {
        setUsers((prevUsers) => {
          const userMessages = prevUsers[message.userId] || [];
          // Check if the message already exists to avoid duplicates
          if (!userMessages.some(msg => msg._id === message._id)) {
            return {
              ...prevUsers,
              [message.userId]: [...userMessages, message]
            };
          }
          return prevUsers;
        });
      });

      newSocket.emit('getAllMessages');
      newSocket.on('allMessages', (messages) => {
        setUsers(messages);
      });

      return () => {
        newSocket.off('newMessage');
        newSocket.off('allMessages');
        newSocket.close();
      };
    }
  }, [isAuthenticated]);

  const authenticateAdmin = async (e) => {
    e.preventDefault();
    console.log('Attempting login with:', { email, password });
    try {
      const response = await axios.post('http://localhost:5000/auth/admin-login', { email, password });
      console.log('Server response:', response.data);
      if (response.data.success) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);
      alert('Invalid email or password');
    }
  };

  const sendReply = () => {
    if (replyMessage.trim() !== '' && selectedUser && socket) {
      socket.emit('adminReply', { userId: selectedUser, message: replyMessage });
      setReplyMessage('');
      // Remove local state update, rely on server broadcast
    }
  };

  if (!isAuthenticated) {
    return (
      <form onSubmit={authenticateAdmin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Admin Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Admin Password"
          required
        />
        <button type="submit">Login</button>
      </form>
    );
  }

  return (
    <div>
      <h1>Admin Panel</h1>
      <div>
        {Object.keys(users).map((userId) => (
          <button key={userId} onClick={() => setSelectedUser(userId)}>
            User {userId}
          </button>
        ))}
      </div>
      {selectedUser && (
        <div>
          <h2>Chat with User {selectedUser}</h2>
          <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px' }}>
            {users[selectedUser].map((msg, index) => (
              <div key={msg._id || index} style={{marginBottom: '10px'}}>
                <strong>{msg.isAdmin ? 'Admin' : 'User'}:</strong> {msg.message}
                <div style={{fontSize: '0.8em', color: '#888'}}>
                  {new Date(msg.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
          <input
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendReply()}
          />
          <button onClick={sendReply}>Reply</button>
        </div>
      )}
    </div>
  );
}

export default AdminMessages;