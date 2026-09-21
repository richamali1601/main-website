import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight, MessageCircle, RefreshCw, Send, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { getBotReply, QUICK_PROMPTS } from "./chatRules";

const STORAGE_KEY = "vision-hive-concierge";
const welcomeMessage = {
  id: "welcome",
  role: "bot",
  text: "Welcome to The Vision Hive. Tell me what you want to improve, and I'll guide you to the right next step.",
  actions: [],
};

const newSession = () => ({
  sessionId: globalThis.crypto?.randomUUID?.() || `vh-${Date.now()}`,
  service: "",
  messages: [welcomeMessage],
});

const loadSession = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return stored?.sessionId && Array.isArray(stored.messages) ? stored : newSession();
  } catch {
    return newSession();
  }
};

export const ConciergeChat = ({ onNavigate }) => {
  const [open,    setOpen]    = useState(false);
  const [input,   setInput]   = useState("");
  const [typing,  setTyping]  = useState(false);
  const [session, setSession] = useState(loadSession);
  const messagesEnd = useRef(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [session, typing]);

  useEffect(() => {
    const closeOnEscape = (event) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const resetChat = () => { setSession(newSession()); setInput(""); setTyping(false); };

  const sendMessage = (text) => {
    const cleanText = text.trim();
    if (!cleanText || typing) return;
    const userMessage = { id: `user-${Date.now()}`, role: "user", text: cleanText, actions: [] };
    setSession(c => ({ ...c, messages: [...c.messages, userMessage] }));
    setInput("");
    setTyping(true);
    window.setTimeout(() => {
      setSession(c => {
        const reply = getBotReply(cleanText, c.service);
        const botMessage = { id: `bot-${Date.now()}`, role: "bot", text: reply.text, actions: reply.actions };
        return { ...c, service: reply.service || c.service, messages: [...c.messages, botMessage] };
      });
      setTyping(false);
    }, 450);
  };

  const handleSubmit   = (e)      => { e.preventDefault(); sendMessage(input); };
  const handleAction   = (action) => { onNavigate(action); setOpen(false); };

  return (
    <>
      {/* ── Launcher button ─────────────────────────────────────── */}
      <button
        className={`chat-launcher-ring fixed right-6 bottom-6 z-[60] min-h-[50px] border border-teal/55 bg-[#0c1215] text-teal flex items-center justify-center gap-[10px] px-[18px] shadow-[0_18px_48px_rgba(0,0,0,0.32)] font-manrope font-bold text-[11px] uppercase cursor-pointer transition-all duration-200 hover:-translate-y-[4px] hover:bg-[#142025] hover:border-teal ${open ? "is-open !w-[50px] !px-0 !bg-teal !text-ink" : ""}`}
        onClick={() => setOpen(c => !c)}
        aria-expanded={open}
        aria-controls="vision-hive-chat"
        aria-label={open ? "Close website concierge" : "Open website concierge"}
        data-testid="chat-launcher-button"
      >
        {open ? <X size={22} /> : <MessageCircle size={23} />}
        {!open && <span>Need help?</span>}
      </button>

      {/* ── Chat panel ──────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.aside
            id="vision-hive-chat"
            className="fixed right-6 bottom-[88px] z-[59] w-[min(390px,calc(100vw-32px))] h-[min(610px,calc(100vh-118px))] bg-[#0b0f12] text-paper border border-paper/[0.17] shadow-[0_28px_80px_rgba(0,0,0,0.5)] grid grid-rows-[auto_1fr_auto_auto] overflow-hidden"
            role="dialog"
            aria-label="The Vision Hive website concierge"
            initial={{ opacity: 0, y: 22, scale: 0.98 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{ opacity: 0,    y: 16, scale: 0.98 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            data-testid="chat-panel"
          >
            {/* Header */}
            <header className="min-h-[72px] px-[17px] py-[14px] pr-[13px] border-b border-line bg-[#11181c] flex items-center gap-[11px]">
              <div className="w-[34px] h-[34px] shrink-0 bg-teal text-ink flex items-center justify-center">
                <Sparkles size={16} />
              </div>
              <div className="min-w-0 mr-auto flex flex-col gap-[3px]">
                <strong className="text-[13px] font-bold">Vision Hive Concierge</strong>
                <span className="font-mono text-[9px] text-[#7d8b8f] uppercase">Online · guided assistance</span>
              </div>
              <button
                onClick={resetChat}
                title="Restart conversation"
                aria-label="Restart conversation"
                className="w-8 h-8 shrink-0 border-0 bg-transparent text-[#899599] flex items-center justify-center cursor-pointer transition-colors duration-200 hover:bg-paper/[0.06] hover:text-teal"
                data-testid="chat-reset-button"
              >
                <RefreshCw size={16} />
              </button>
              <button
                onClick={() => setOpen(false)}
                title="Close concierge"
                aria-label="Close concierge"
                className="w-8 h-8 shrink-0 border-0 bg-transparent text-[#899599] flex items-center justify-center cursor-pointer transition-colors duration-200 hover:bg-paper/[0.06] hover:text-teal"
                data-testid="chat-close-button"
              >
                <X size={18} />
              </button>
            </header>

            {/* Messages */}
            <div
              className="px-[18px] py-[22px] overflow-y-auto [scrollbar-width:thin] [scrollbar-color:#314044_transparent]"
              aria-live="polite"
              data-testid="chat-message-list"
            >
              {session.messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex flex-col mb-[15px] ${message.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[88%] px-[13px] py-3 text-[13px] leading-[1.55] ${
                      message.role === "user"
                        ? "bg-teal text-ink"
                        : "bg-[#172025] text-[#d8ddde] border-l-2 border-teal"
                    }`}
                    data-testid={`chat-message-${message.role}-${index}`}
                  >
                    {message.text}
                  </div>
                  {message.actions?.length > 0 && (
                    <div className="max-w-[88%] flex flex-wrap gap-[7px] mt-2">
                      {message.actions.map((action, actionIndex) => (
                        <button
                          key={`${message.id}-${action.target}-${actionIndex}`}
                          onClick={() => handleAction(action)}
                          className="border border-teal/36 bg-transparent text-teal min-h-[34px] px-[10px] py-2 inline-flex items-center gap-[7px] font-manrope font-bold text-[10px] uppercase cursor-pointer transition-all duration-200 hover:bg-teal hover:text-ink hover:-translate-y-[2px]"
                          data-testid={`chat-action-${index}-${actionIndex}-${action.target}`}
                        >
                          {action.label}<ArrowUpRight size={14} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {typing && (
                <div className="flex items-start mb-[15px]" data-testid="chat-typing-indicator">
                  <div className="h-[38px] px-[14px] bg-[#172025] border-l-2 border-teal flex items-center gap-[5px]">
                    {[0, 0.13, 0.26].map((delay, i) => (
                      <i
                        key={i}
                        className="block w-[5px] h-[5px] bg-teal rounded-full animate-typing-dot not-italic"
                        style={{ animationDelay: `${delay}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEnd} />
            </div>

            {/* Quick prompts (shown on fresh session) */}
            {session.messages.length === 1 && (
              <div
                className="px-[18px] pb-[14px] grid grid-cols-2 gap-[7px]"
                data-testid="chat-quick-prompts"
              >
                {QUICK_PROMPTS.map((prompt, index) => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    className="min-h-[38px] border border-line bg-[#12191d] text-[#aeb7b9] p-2 text-left font-manrope font-semibold text-[10px] cursor-pointer transition-all duration-200 hover:border-teal/52 hover:text-teal hover:bg-[#162126]"
                    data-testid={`chat-quick-prompt-${index + 1}`}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Input row */}
            <form
              className="mx-[14px] border-t border-line grid grid-cols-[1fr_42px] items-center"
              onSubmit={handleSubmit}
              data-testid="chat-input-form"
            >
              <label htmlFor="chat-message-input" className="sr-only">Your question</label>
              <input
                id="chat-message-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                maxLength={500}
                placeholder="What would you like to improve?"
                disabled={typing}
                autoComplete="off"
                className="w-full h-[54px] border-0 bg-transparent text-paper outline-none font-manrope text-[13px] px-[7px] placeholder:text-[#687478]"
                data-testid="chat-message-input"
              />
              <button
                type="submit"
                disabled={!input.trim() || typing}
                aria-label="Send message"
                className="w-[38px] h-[38px] border-0 bg-teal text-ink flex items-center justify-center cursor-pointer transition-all duration-200 hover:not-disabled:-translate-y-[2px] disabled:opacity-[0.28] disabled:cursor-not-allowed"
                data-testid="chat-send-button"
              >
                <Send size={17} />
              </button>
            </form>

            <p className="m-0 px-[18px] py-[8px] pb-[13px] text-center font-mono text-[8px] uppercase text-[#637074]" data-testid="chat-privacy-note">
              Guided help only · contact details stay in the project brief
            </p>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};