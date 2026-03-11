import axios from "axios";
import React, { useState, useRef, useEffect } from "react";

export default function SupportChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi 👋 How can we help you today? You can ask about:\n• Shipping\n• Returns\n• Track Order\n• Product Recommendations..!" }
  ]);
  const [input, setInput] = useState("");
const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages(prev => [...prev, userMsg]);

    try {
      const res = await axios.post("https://candlesecommerceproject.onrender.com/api/support-chat", {
        message: input
      });

      const botMsg = { role: "bot", text: res.data.reply };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: "bot", text: "Server error. Please try again later." }
      ]);
    }

    setInput("");
  };

  useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);

  return (
    <>
      {/* Button */}
      <button
        onClick={() => setOpen(!open)}
        className="mt-3 inline-flex items-center gap-2 h-10 px-4 rounded-md bg-primary text-text text-sm font-bold hover:bg-primary/90 transition"
      >
        Start a Chat
      </button>

      {/* Chat Box */}
     {open && (
  <div className="fixed bottom-5 right-5 w-80 h-96 bg-white rounded-2xl shadow-xl flex flex-col z-50">

    {/* Header */}
    <div className="flex justify-between items-center bg-primary text-white px-4 py-3 rounded-t-2xl">
      <h3 className="font-semibold">Support Chat</h3>
      <button
        onClick={() => setOpen(false)}
        className="text-white font-bold text-lg"
      >
        ✕
      </button>
    </div>

    {/* Messages */}
{/* Messages */}
<div className="flex-1 overflow-y-auto p-4 space-y-3">
  {messages.map((msg, i) => (
    <div
      key={i}
      className={`flex ${
        msg.role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`text-sm px-3 py-2 rounded-2xl max-w-[75%] break-words ${
          msg.role === "user"
            ? "bg-primary text-white rounded-br-none"
            : "bg-gray-100 text-gray-800 rounded-bl-none"
        }`}
      >
        {msg.text}
      </div>
    </div>
  ))}
  <div ref={messagesEndRef} />
</div>

    {/* Input */}
    <div className="flex p-3 gap-2 border-t">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="flex-1 border rounded-md px-2 py-1"
        placeholder="Type your message..."
      />
      <button
        onClick={sendMessage}
        className="bg-primary text-white px-3 rounded-md"
      >
        Send
      </button>
    </div>
  </div>
)}
    </>
  );
}