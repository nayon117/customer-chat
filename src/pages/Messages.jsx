import { useState, useEffect } from "react";
import io from "socket.io-client";

const BACKEND_URL = "https://chat-server-bij9.onrender.com";

function Messages() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const userId =
      localStorage.getItem("userId") || Math.random().toString(36).substring(7);
    localStorage.setItem("userId", userId);

    const newSocket = io(BACKEND_URL, {
      query: { userId },
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    setSocket(newSocket);

    newSocket.on("connect", () => setConnectionStatus("Connected"));
    newSocket.on("disconnect", () => setConnectionStatus("Disconnected"));
    newSocket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      setConnectionStatus("Connection error. Retrying...");
    });

    newSocket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    newSocket.emit("getHistory");
    newSocket.on("history", (history) => {
      setMessages(history);
    });

    return () => {
      newSocket.off("connect");
      newSocket.off("disconnect");
      newSocket.off("connect_error");
      newSocket.off("message");
      newSocket.off("history");
      newSocket.close();
    };
  }, []);

  const sendMessage = () => {
    if (inputMessage.trim() !== '') {
      socket.emit('sendMessage', inputMessage);
      setInputMessage('');
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4 text-pink-600 text-center">
          Chat Directly
        </h1>
        <p className="text-sm text-gray-500 mb-2 text-center">
          {connectionStatus}
        </p>
        <div className="h-80 overflow-y-auto mb-4 border border-pink-200 rounded-lg p-4 bg-pink-50">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.isAdmin ? "justify-start" : "justify-end"
              } mb-4`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  msg.isAdmin
                    ? "bg-white text-gray-800 border border-pink-300"
                    : "bg-pink-500 text-white "
                }`}
              >
                <div className="flex items-center gap-1">
                  <p
                    className={`text-xs mt-1 ${
                      msg.isAdmin ? "text-gray-500" : "text-pink-200"
                    }`}
                  >
                    {msg.isAdmin ? "Admin : " : ""}
                  </p>
                  <p className="text-sm">{msg.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex">
          <input
            className="flex-grow mr-2 px-4 py-2 border border-pink-300 rounded-lg focus:outline-none outline-none"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
          />
        </div>
      </div>
    </div>
  );
}

export default Messages;
