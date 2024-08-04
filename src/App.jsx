import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Messages from './pages/Messages';
import Help from './pages/Help';
import ChatButton from './components/ChatButton'
import ChatLayout from './layout/ChatLayout';


function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <Router>
      <div className="relative min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          {isChatOpen && (
            <Route path="/chat/*" element={<ChatLayout toggleChat={toggleChat} />}>
              <Route path="home" element={<Home />} />
              <Route path="messages" element={<Messages />} />
              <Route path="help" element={<Help />} />
            </Route>
          )}
        </Routes>
        <ChatButton toggleChat={toggleChat} />
      </div>
    </Router>
  );
}

export default App;
