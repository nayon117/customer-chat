/* eslint-disable react/prop-types */

const ChatbotButton = ({ toggleChat }) => {
  return (
    <button onClick={toggleChat} className="fixed bottom-8 right-8 bg-pink-600 text-white p-4 rounded-full shadow-lg">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 16c.6-2.6 0-5.7-2-8-2-2-5.3-2.8-8-2a9 9 0 00-4 1m8 17v-6a9 9 0 00-1-4c-1.2-1.2-3-2-5-2-2.7 0-5 1-8 2-2 2-2.5 5.4-2 8.1.5 2.5 2 4.8 3.9 6.5a9 9 0 007 2.4c2.7 0 5.3-1 7.1-2.9 1.7-1.8 2.6-4 2.6-6.2z" />
      </svg>
    </button>
  );
};

export default ChatbotButton;
