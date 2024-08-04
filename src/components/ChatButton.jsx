/* eslint-disable react/prop-types */

const ChatbotButton = ({ toggleChat }) => {
  return (
    <button
      onClick={toggleChat}
      className="fixed bottom-8 right-8 bg-pink-600 text-white p-4 rounded-full shadow-lg"
    >
      <span className="flex items-center">
        <svg
          className="w-6 h-6 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 5-4 9-9 9-1.61 0-3.12-.38-4.44-1.05L3 21l1.05-4.44C3.38 15.12 3 13.61 3 12c0-5 4-9 9-9s9 4 9 9z"
          ></path>
        </svg>
        Need Help? Chat with us
      </span>
    </button>
  );
};

export default ChatbotButton;
