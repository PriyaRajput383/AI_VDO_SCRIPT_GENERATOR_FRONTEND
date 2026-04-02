import { useState } from "react";
import axios from "axios";

function Index() {
  const [topic, setTopic] = useState("");
  const [messages, setMessages] = useState([]);

  const generateScript = async () => {
    if (!topic) return;

    const newMessages = [
      ...messages,
      { role: "user", text: topic }
    ];
    setMessages(newMessages);
    setTopic("");

    try {
      const res = await axios.post(
        "https://ai-vdo-script-generator-backend.onrender.com/generate-script",
        { topic }
      );

      setMessages([
        ...newMessages,
        { role: "ai", text: res.data.script }
      ]);
    } catch (err) {
      console.log("ERROR:", err.response?.data || err.message);

      setMessages([
        ...newMessages,
        { role: "ai", text: "⚠️ Error generating script. Try again." }
      ]);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-black text-white px-20 py-10">

      <div className="p-4 text-center border-b border-gray-800 text-xl font-semibold">
        AI Shorts Script Generator
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-xl p-3 rounded-lg ${
              msg.role === "user"
                ? "bg-purple-600 ml-auto"
                : "bg-gray-800 mr-auto"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-800 flex gap-2">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Write video topic"
          className="flex-1 p-3 rounded-lg bg-gray-900 outline-none"
        />
        <button
          onClick={generateScript}
          className="bg-purple-600 px-4 rounded-lg"
        >
          Send
        </button>
      </div>

    </div>
  );
}

export default Index;