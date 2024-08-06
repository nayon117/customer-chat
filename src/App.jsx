/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Messages from './pages/Messages';
import Help from './pages/Help';
import ChatButton from './components/ChatButton';
import ChatLayout from './layout/ChatLayout';
import ChatHome from './pages/ChatHome';
import './index.css';
import AdminMessages from './components/AdminMessages';

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [previousPath, setPreviousPath] = useState('/');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isChatOpen) {
      setPreviousPath(location.pathname);
    }
  }, [location, isChatOpen]);

  const toggleChat = () => {
    if (isChatOpen) {
      navigate(previousPath);
    } else {
      navigate('/chat/chat-home');
    }
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="relative min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin-messages" element={<AdminMessages />} />
        {isChatOpen && (
          <Route path="/chat" element={<ChatLayout isChatOpen={isChatOpen} toggleChat={toggleChat} />}>
            <Route path="chat-home" element={<ChatHome />} />
            <Route path="messages" element={<Messages />} />
            <Route path="help" element={<Help />} />
          </Route>
        )}
      </Routes>
      <ChatButton toggleChat={toggleChat} />
    </div>
  );
}

function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default WrappedApp;
