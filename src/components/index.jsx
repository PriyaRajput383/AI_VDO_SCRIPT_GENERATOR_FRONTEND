import { useState, useRef, useEffect } from "react";
import axios from "axios";

function Index() {
  const [topic, setTopic] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const generateScript = async () => {
    if (!topic || loading) return;

    const newMessages = [
      ...messages,
      { role: "user", text: topic }
    ];

    setMessages(newMessages);
    setTopic("");
    setLoading(true);

    try {
      // small delay so animation is visible
      await new Promise((r) => setTimeout(r, 800));

      const res = await axios.post(
        "http://localhost:3000/generate-script",
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

    setLoading(false);
  };

  // auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">

      {/* HEADER */}
      <div className="text-center py-6 text-2xl font-semibold text-gray-700">
        ✨ AI Shorts Script Generator
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto px-4 md:px-20 pb-4 max-w-4xl w-full mx-auto">

        {/* 👇 EMPTY STATE */}
        {messages.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-600 px-4">
            <div className="text-2xl md:text-3xl font-semibold mb-2">
              👋 Hey, what’s up?
            </div>
            <div className="text-lg md:text-xl">
              On which topic do you need a script today?
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Let’s work together ✨
            </div>
          </div>
        ) : (
          <div className="space-y-4">

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-4 rounded-2xl max-w-[80%] shadow-sm ${
                  msg.role === "user"
                    ? "bg-purple-400 text-white ml-auto"
                    : "bg-white text-gray-700 mr-auto"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {/* 🔄 LOADING ANIMATION */}
            {loading && (
              <div className="bg-white p-4 rounded-2xl w-fit shadow-sm mr-auto">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}

            <div ref={bottomRef}></div>
          </div>
        )}
      </div>

      {/* INPUT AREA */}
      <div className="p-4 w-full max-w-4xl mx-auto flex gap-2">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Write your video topic..."
          className="flex-1 p-3 rounded-full border border-gray-300 outline-none focus:ring-2 focus:ring-purple-300"
        />

        <button
          onClick={generateScript}
          disabled={loading}
          className="bg-purple-400 hover:bg-purple-500 text-white px-5 rounded-full transition disabled:opacity-50"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>

    </div>
  );
}

export default Index;