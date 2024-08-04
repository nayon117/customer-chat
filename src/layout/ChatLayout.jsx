/* eslint-disable react/prop-types */
import { Outlet, Link } from 'react-router-dom';

const ChatLayout = ({ toggleChat }) => {
  return (
    <div className="fixed inset-y-5 bottom-20 right-5 bg-white w-80  shadow-lg rounded-lg p-4 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-xl font-bold">AI Chat Support</h1>
        <button onClick={toggleChat} className="text-lg">&times;</button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <Outlet />
      </div>
      <div className="flex justify-around p-4 border-t">
        <Link to="home" className="flex flex-col items-center">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          <span className="text-sm">Home</span>
        </Link>
        <Link to="messages" className="flex flex-col items-center">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h8m-6 8h.01" />
          </svg>
          <span className="text-sm">Messages</span>
        </Link>
        <Link to="help" className="flex flex-col items-center">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m2 4h2M3 16h2m4 4h8m4-4a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span className="text-sm">Help</span>
        </Link>
      </div>
    </div>
  );
};

export default ChatLayout;
