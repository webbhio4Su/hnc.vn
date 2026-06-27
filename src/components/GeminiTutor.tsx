import { useState, useRef, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Send, Bot, User, Loader2, X } from "lucide-react";
import Markdown from "react-markdown";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function GeminiTutor({ currentLesson }: { currentLesson: string }) {
  const [messages, setMessages] = useState<{ role: "user" | "bot"; content: string }[]>([
    { role: "bot", content: "Chào bạn! Mình là trợ lý toán học AI. Bạn cần mình giải thích gì về bài học này không?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: "user", parts: [{ text: `Bạn là một gia sư toán tiểu học tại Việt Nam. Hãy giải thích ngắn gọn, dễ hiểu nhất cho một học sinh lớp 5. Bài học hiện tại là: ${currentLesson}. Câu hỏi của học sinh: ${userMessage}` }] }
        ],
        config: {
          systemInstruction: "Hãy trả lời bằng tiếng Việt. Sử dụng ngôn ngữ thân thiện, khích lệ. Giải thích từng bước. Có thể dùng emoji phù hợp. Nếu câu hỏi không liên quan đến toán, hãy nhắc nhở học sinh tập trung vào bài học.",
          temperature: 0.7,
        }
      });

      setMessages(prev => [...prev, { role: "bot", content: response.text || "Xin lỗi, mình gặp chút trục trặc. Bạn thử lại nhé!" }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: "bot", content: "Lỗi kết nối rồi. Hãy kiểm tra lại nhé!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 w-full lg:w-96 shrink-0">
      <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white">
          <Sparkles size={18} />
        </div>
        <h3 className="font-bold text-slate-900 dark:text-white">Gia sư AI</h3>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
              m.role === "user" 
                ? "bg-blue-600 text-white rounded-tr-none" 
                : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-none shadow-sm"
            }`}>
              <div className="markdown-body dark:prose-invert">
                <Markdown>{m.content}</Markdown>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-2">
              <Loader2 className="animate-spin text-purple-600" size={16} />
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium italic">Đang suy nghĩ...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Hỏi mình bất cứ điều gì..."
            className="w-full pl-4 pr-12 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all dark:text-white"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1.5 p-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 text-center">
          Được hỗ trợ bởi Gemini AI
        </p>
      </div>
    </div>
  );
}
