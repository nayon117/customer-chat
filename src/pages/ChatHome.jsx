// src/pages/Home.js
import { useState } from "react";
import { FaChevronRight } from "react-icons/fa";

const ChatHome = () => {
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  const toggleQuestion = (question) => {
    setExpandedQuestion(expandedQuestion === question ? null : question);
  };

  const questionsAndAnswers = [
    {
      question: "App Setting",
      answer:
        "To access app settings, go to the settings tab in the menu and make the necessary changes.",
    },
    {
      question: "Business Setup",
      answer:
        "Setting up your business involves several steps, including registration, choosing a business structure, and setting up a business plan.",
    },
    {
      question: "How can I talk to customer support?",
      answer:
        "You can talk to customer support by clicking the chat button on this page or calling our support number.",
    },
    {
      question: "Can I chat with a live agent?",
      answer:
        'Yes, you can chat with a live agent by clicking on the "Chat with us" button.',
    },
    {
      question: "How to setup my business?",
      answer:
        "To set up your business, follow our step-by-step guide available in the help section.",
    },
  ];

  return (
    <div className="p-2">
      <h2 className="text-2xl font-bold mb-4 text-pink-600 text-center">How can we help you today?</h2>
      <div className="space-y-4">
        <div className="bg-gray-100 p-2 rounded-md">
          <p className="text-sm font-semibold">Recent Chat</p>
          <div className="space-y-2 flex items-center justify-between">
            {questionsAndAnswers.slice(0, 2).map((item, index) => (
              <div key={index}>
                <button
                  onClick={() => toggleQuestion(item.question)}
                  className="text-sm "
                >
                  <p className="">{item.question}</p>
                </button>
                {expandedQuestion === item.question && (
                  <p className="mt-2 text-gray-700">{item.answer}</p>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gray-100 p-2 rounded-md">
          <p className="text-sm">Server Status: Operational</p>
        </div>
        <div className="bg-gray-100 p-2 rounded-md">
          <p className="text-sm font-semibold">Help</p>
          <div className="space-y-2">
            {questionsAndAnswers.slice(2).map((item, index) => (
              <div key={index}>
                <button
                  onClick={() => toggleQuestion(item.question)}
                  className="text-md text-left w-full"
                >
                  <p className="flex items-center justify-between ">
                    {item.question}
                    <span>
                      <FaChevronRight />
                    </span>
                  </p>
                </button>
                {expandedQuestion === item.question && (
                  <p className="mt-2 text-gray-700">{item.answer}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHome;
