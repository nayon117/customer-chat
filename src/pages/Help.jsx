import { useState, useRef, useEffect } from "react";
import { BsSend } from "react-icons/bs";

const Help = () => {
  // states
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatWindowRef = useRef(null);
  const VITE_APP_OPENROUTER_API = import.meta.env.VITE_APP_OPENROUTER_API;

  // send message functionality
  const sendMessage = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${VITE_APP_OPENROUTER_API}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gryphe/mythomist-7b:free",
            messages: [{ role: "user", content: inputText }],
          }),
        }
      );
      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        const botResponse = data.choices[0].message.content;
        const newMessage = {
          userQuestion: inputText,
          botResponse: botResponse,
        };
        setMessages([...messages, newMessage]);
      } else {
        const newMessage = {
          userQuestion: inputText,
          botResponse: "Sorry, I couldn't understand that.",
        };
        setMessages([...messages, newMessage]);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputText.trim() !== "") {
      // Add user's message to chat before sending
      setMessages([...messages, { userQuestion: inputText, botResponse: "" }]);
      await sendMessage();
      setInputText("");
    }
  };

  // scroll to bottom of chat window
  useEffect(() => {
    chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
  }, [messages]);

  return (
    <div className="p-2">
      <h2 className="text-2xl font-bold mb-4">Help</h2>
      <section className="flex flex-col mt-6">
        <div
          className=" flex-grow mt-4 overflow-y-auto border border-gray-300 rounded-md p-4"
          ref={chatWindowRef}
        >
          {messages.map((msg, index) => (
            <div key={index} className="mb-6">
              {msg.userQuestion && (
                <div className="flex items-center mb-2">
                  <p className=" bg-pink-500 text-white p-2 rounded-md">{msg.userQuestion}</p>
                </div>
              )}
              {msg.botResponse === "" && isLoading && (
                <div className="flex items-center mb-2">
                  <div className="chat-bubble bg-gray-200 p-2 rounded-md italic">
                  <div className="w-10 h-10 flex gap-1 items-center justify-center"><div className="w-2 h-2 animate-[bounce_.6s_linear_.2s_infinite] bg-pink-500 rounded-full"></div><div className="w-2 h-2 animate-[bounce_.6s_linear_.3s_infinite] bg-pink-500 rounded-full"></div><div className="w-2 h-2 animate-[bounce_.6s_linear_.4s_infinite] bg-pink-500 rounded-full"></div></div>
                  </div>
                </div>
              )}
              {msg.botResponse !== "" && (
                <div className="mt-5">
                  <p className="chat-bubble bg-gray-300 p-2 rounded-md">{msg.botResponse}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="w-full relative">
            <input
              type="text"
              className="border text-sm block w-full p-2.5 border-gray-300 outline-none bg-white mb-4"
              placeholder="Write a prompt here..."
              value={inputText}
              onChange={handleInputChange}
            />
            <button
              type="submit"
              className="absolute inset-y-0 end-0 flex items-center pe-3"
              disabled={isLoading}
            >
              {isLoading ? (
               <span className="animate-spin">...</span>
              ) : (
                <BsSend />
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Help;
