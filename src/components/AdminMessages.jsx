import { useState, useEffect } from "react";
import io from "socket.io-client";

const BACKEND_URL = "https://chat-server-bij9.onrender.com";

function AdminMessages() {
  const [socket, setSocket] = useState(null);
  const [users, setUsers] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");

  useEffect(() => {
    if (isAuthenticated) {
      const newSocket = io(BACKEND_URL, {
        query: { userId: "admin" },
        auth: { token: "admin-token" },
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

      newSocket.on("newMessage", (message) => {
        setUsers((prevUsers) => {
          const userMessages = prevUsers[message.userId] || [];
          if (!userMessages.some((msg) => msg._id === message._id)) {
            return {
              ...prevUsers,
              [message.userId]: [...userMessages, message],
            };
          }
          return prevUsers;
        });
      });

      newSocket.emit("getAllMessages");
      newSocket.on("allMessages", (messages) => {
        setUsers(messages);
      });

      return () => {
        newSocket.off("connect");
        newSocket.off("disconnect");
        newSocket.off("connect_error");
        newSocket.off("newMessage");
        newSocket.off("allMessages");
        newSocket.close();
      };
    }
  }, [isAuthenticated]);

  const authenticateAdmin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BACKEND_URL}/auth/admin-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin":
            "https://customer-chat-five.vercel.app",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(true);
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      console.error("Login error:", error.message);
      alert("Invalid email or password");
    }
  };

  const sendReply = () => {
    if (replyMessage.trim() !== '' && selectedUser && socket) {
      socket.emit('adminReply', { userId: selectedUser, message: replyMessage });
      setReplyMessage('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <form
          onSubmit={authenticateAdmin}
          className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
        >
          <h2 className="text-2xl font-bold mb-6 text-pink-600 text-center">
            Admin Login
          </h2>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Admin Email"
            required
            className="w-full px-3 py-2 mb-4 border border-pink-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin Password"
            required
            className="w-full px-3 py-2 mb-6 border border-pink-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-2 rounded-md hover:bg-pink-700 transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col md:flex-row">
      <div className="w-full md:w-1/4 bg-pink-100 p-4 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4 text-pink-800">Admin Panel</h1>
        <p className="text-sm text-gray-600 mb-4">Status: {connectionStatus}</p>
        <div className="flex flex-col space-y-2">
          {Object.keys(users).map((userId) => (
            <button
              key={userId}
              onClick={() => setSelectedUser(userId)}
              className={`px-4 py-2 rounded-md transition duration-300 ${
                selectedUser === userId
                  ? "bg-pink-600 text-white"
                  : "bg-white text-pink-800 hover:bg-pink-200"
              }`}
            >
              User {userId}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 p-4">
        {selectedUser ? (
          <div className="bg-white rounded-lg shadow-md h-full flex flex-col">
            <h2 className="text-xl font-semibold mb-4 p-4 bg-pink-600 text-white rounded-t-lg">
              Chat with User {selectedUser}
            </h2>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {users[selectedUser].map((msg, index) => (
                <div
                  key={msg._id || index}
                  className={`p-3 rounded-lg ${
                    msg.isAdmin ? "bg-pink-100 ml-auto" : "bg-gray-100"
                  } max-w-3/4`}
                >
                  <strong className="text-pink-800">
                    {msg.isAdmin ? "Admin" : "User"}:
                  </strong>{" "}
                  {msg.message}
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(msg.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-pink-200">
              <div className="flex space-x-2">
                <input
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendReply()}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-pink-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <button
                  onClick={sendReply}
                  className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition duration-300"
                >
                  Reply
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-pink-800 text-xl">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminMessages;
