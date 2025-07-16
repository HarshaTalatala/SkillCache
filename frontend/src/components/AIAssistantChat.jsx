import React, { useState, useRef, useEffect } from 'react';
import { Bot, Loader2, FilePlus, History } from 'lucide-react';

const mockNotes = [
  { id: 1, title: 'React Hooks Overview' },
  { id: 2, title: 'Vault: Project Roadmap' },
  { id: 3, title: 'Dashboard: Meeting Notes' },
];

const mockChatHistory = [
  { id: 1, title: 'Chat with React AI', date: '2024-06-01' },
  { id: 2, title: 'Vault Q&A', date: '2024-05-30' },
  { id: 3, title: 'General Help', date: '2024-05-28' },
];

const AIAssistantChat = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I am your AI Assistant. How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  useEffect(() => {
    // Only auto-scroll on desktop (sm and up)
    const isDesktop = window.innerWidth >= 640;
    if (isDesktop) {
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    // Placeholder for Gemini API integration
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'This is a sample AI response. (Gemini integration coming soon!)' },
      ]);
      setLoading(false);
    }, 1200);
  };

  const handleAddNoteToInput = (note) => {
    setInput((prev) => prev ? prev + ' ' + note.title : note.title);
    setShowNoteModal(false);
  };

  return (
    <div
      className="flex flex-col bg-background h-screen sm:overflow-hidden"
      style={{ minHeight: 'calc(var(--app-vh, 1vh) * 100)' }}
    >
      <div className="w-full flex-1 flex flex-col items-center min-h-0">
        <div className="w-full sm:max-w-3xl sm:mx-auto flex flex-col flex-1 h-full">
          {/* Header */}
          <div className="flex items-center justify-between gap-2 sm:gap-4 px-2 sm:px-8 pt-4 sm:pt-6 pb-2 sm:pb-3 border-b border-border/30 bg-background/80 backdrop-blur-md shadow-sm z-10 flex-shrink-0">
            <div className="flex items-center gap-2 sm:gap-4">
              <Bot className="text-primary" size={28} />
              <span className="font-bold text-base sm:text-2xl tracking-wide">AI Assistant</span>
            </div>
            <button
              type="button"
              className="flex items-center justify-center p-1.5 sm:p-2 rounded-full bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 focus:ring-2 focus:ring-primary/40 transition-colors"
              aria-label="Chat History"
              onClick={() => setShowHistoryModal(true)}
            >
              <History size={16} className="sm:w-5 sm:h-5 w-4 h-4" />
              <span className="sr-only">Chat History</span>
            </button>
          </div>
          {/* Chat area (scrollable) */}
          <div className="flex-1 flex flex-col min-h-0 w-full space-y-2 sm:space-y-3 p-2 sm:p-4 pb-[72px] sm:pb-2">
            <div
              className="chat-messages-inner flex flex-col flex-1 min-h-0"
              style={{
                width: '100%',
                overflowY: 'auto',
                minHeight: 0,
                paddingBottom: window.innerWidth < 640 ? 68 : 8
              }}
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[90vw] sm:max-w-[70%] px-3 py-2 rounded-2xl text-[15px] sm:text-base shadow-sm break-words ${
                      msg.role === 'user'
                        ? 'bg-primary text-white rounded-br-xl'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-foreground rounded-bl-xl'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 text-foreground px-3 py-2 rounded-2xl rounded-bl-xl shadow-sm">
                    <Loader2 className="animate-spin w-4 h-4" />
                    <span>Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
          {/* Desktop input (part of main layout flow) */}
          <form
            onSubmit={handleSend}
            className="hidden sm:flex flex-row items-center p-4 border-t border-border/30 bg-background gap-2 w-full flex-shrink-0"
          >
            <button
              type="button"
              className="flex items-center justify-center p-2 rounded-full bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20"
              onClick={() => setShowNoteModal(true)}
              aria-label="Add note to ask about"
            >
              <FilePlus size={20} />
            </button>
            <input
              type="text"
              className="flex-1 px-4 py-2 rounded-full border border-border/50 bg-transparent dark:bg-transparent focus:border-2 focus:border-primary focus:outline-none focus:ring-0 transition-colors duration-200"
              placeholder="Ask anything, or type /summarize..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded-full font-semibold hover:bg-primary/90 disabled:opacity-60"
              disabled={loading || !input.trim()}
            >
              Send
            </button>
          </form>
        </div>
        {/* Mobile fixed input (remains outside the desktop flow) */}
        <form
          onSubmit={handleSend}
          className="p-2 border-t border-border/30 bg-background flex gap-2 fixed bottom-0 left-0 w-full z-20 sm:hidden"
          style={{ height: 60 }}
        >
          <button
            type="button"
            className="flex items-center justify-center p-3 rounded-full bg-primary/10 text-primary border border-primary/30"
            onClick={() => setShowNoteModal(true)}
            aria-label="Add note to ask about"
          >
            <FilePlus size={20} />
          </button>
          <input
            type="text"
            className="flex-1 px-4 py-3 rounded-full border border-border/50 bg-transparent dark:bg-transparent focus:border-2 focus:border-primary focus:outline-none focus:ring-0 transition-colors duration-200"
            placeholder="Ask anything, or type /summarize..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            style={{ minHeight: 44 }}
          />
          <button
            type="submit"
            className="bg-primary text-white px-5 py-3 rounded-full font-semibold disabled:opacity-60"
            disabled={loading || !input.trim()}
            style={{ minHeight: 44 }}
          >
            Send
          </button>
        </form>
      </div>
      {/* Modals are unchanged */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 rounded-t-2xl sm:rounded-xl shadow-lg p-6 w-full max-w-md mx-auto sm:mb-0 mb-0 animate-slide-up">
            <h2 className="text-lg font-semibold mb-4">Select a Note to Ask About</h2>
            <ul className="space-y-2 mb-4">
              {mockNotes.map((note) => (
                <li key={note.id}>
                  <button
                    className="w-full text-left px-4 py-2 rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors"
                    onClick={() => handleAddNoteToInput(note)}
                  >
                    {note.title}
                  </button>
                </li>
              ))}
            </ul>
            <button
              className="mt-2 px-4 py-2 rounded-lg bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-100 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors w-full"
              onClick={() => setShowNoteModal(false)}
            >
              Cancel
            </button>
          </div>
          <style>{`
            @media (max-width: 639px) {
              .animate-slide-up {
                animation: slideUp 0.25s cubic-bezier(0.4, 0, 0.2, 1);
              }
              @keyframes slideUp {
                from { transform: translateY(100%); }
                to { transform: translateY(0); }
              }
            }
          `}</style>
        </div>
      )}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex sm:items-center items-end justify-center overflow-y-auto">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowHistoryModal(false)} />
          {/* Side panel for desktop/tablet, drawer for mobile */}
          <div className="relative ml-auto h-full w-full sm:max-w-md bg-white dark:bg-zinc-900 shadow-2xl flex flex-col max-h-screen animate-slide-in-right sm:rounded-xl rounded-t-2xl sm:mb-0 mb-0">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/30">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <History size={20} className="text-primary" /> Chat History
              </h2>
              <button
                className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                onClick={() => setShowHistoryModal(false)}
                aria-label="Close chat history"
              >
                <span className="text-xl">×</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <ul className="space-y-2 mb-4">
                {mockChatHistory.map((chat) => (
                  <li key={chat.id}>
                    <button
                      className="w-full text-left px-4 py-2 rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors"
                    >
                      <span className="font-medium">{chat.title}</span>
                      <span className="ml-2 text-xs text-muted-foreground">{chat.date}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <style>{`
            @media (min-width: 640px) {
              .animate-slide-in-right {
                animation: slideInRight 0.25s cubic-bezier(0.4, 0, 0.2, 1);
              }
              @keyframes slideInRight {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
              }
            }
            @media (max-width: 639px) {
              .animate-slide-in-right {
                animation: slideUp 0.25s cubic-bezier(0.4, 0, 0.2, 1);
              }
              @keyframes slideUp {
                from { transform: translateY(100%); }
                to { transform: translateY(0); }
              }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default AIAssistantChat;