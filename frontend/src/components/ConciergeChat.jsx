import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight, MessageCircle, RefreshCw, Send, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { getBotReply, QUICK_PROMPTS } from "./chatRules";
import "./ConciergeChat.css";

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
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
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

  const resetChat = () => {
    setSession(newSession());
    setInput("");
    setTyping(false);
  };

  const sendMessage = (text) => {
    const cleanText = text.trim();
    if (!cleanText || typing) return;
    const userMessage = { id: `user-${Date.now()}`, role: "user", text: cleanText, actions: [] };
    setSession(current => ({ ...current, messages: [...current.messages, userMessage] }));
    setInput("");
    setTyping(true);

    window.setTimeout(() => {
      setSession(current => {
        const reply = getBotReply(cleanText, current.service);
        const botMessage = { id: `bot-${Date.now()}`, role: "bot", text: reply.text, actions: reply.actions };
        return { ...current, service: reply.service || current.service, messages: [...current.messages, botMessage] };
      });
      setTyping(false);
    }, 450);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage(input);
  };

  const handleAction = (action) => {
    onNavigate(action);
    setOpen(false);
  };

  return <>
    <button
      className={`chat-launcher ${open ? "is-open" : ""}`}
      onClick={() => setOpen(current => !current)}
      aria-expanded={open}
      aria-controls="vision-hive-chat"
      aria-label={open ? "Close website concierge" : "Open website concierge"}
      data-testid="chat-launcher-button"
    >
      {open ? <X size={22} /> : <MessageCircle size={23} />}
      {!open && <span>Need help?</span>}
    </button>

    <AnimatePresence>
      {open && <motion.aside
        id="vision-hive-chat"
        className="chat-panel"
        role="dialog"
        aria-label="The Vision Hive website concierge"
        initial={{ opacity: 0, y: 22, scale: .98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: .98 }}
        transition={{ duration: .24, ease: [.22, 1, .36, 1] }}
        data-testid="chat-panel"
      >
        <header className="chat-header">
          <div className="chat-mark"><Sparkles size={16} /></div>
          <div><strong>Vision Hive Concierge</strong><span>Online · guided assistance</span></div>
          <button onClick={resetChat} title="Restart conversation" aria-label="Restart conversation" data-testid="chat-reset-button"><RefreshCw size={16} /></button>
          <button onClick={() => setOpen(false)} title="Close concierge" aria-label="Close concierge" data-testid="chat-close-button"><X size={18} /></button>
        </header>

        <div className="chat-messages" aria-live="polite" data-testid="chat-message-list">
          {session.messages.map((message, index) => <div key={message.id} className={`chat-message-row ${message.role}`}>
            <div className="chat-message" data-testid={`chat-message-${message.role}-${index}`}>{message.text}</div>
            {message.actions?.length > 0 && <div className="chat-actions">
              {message.actions.map((action, actionIndex) => <button
                key={`${message.id}-${action.target}-${actionIndex}`}
                onClick={() => handleAction(action)}
                data-testid={`chat-action-${message.id}-${actionIndex}`}
              >{action.label}<ArrowUpRight size={14} /></button>)}
            </div>}
          </div>)}
          {typing && <div className="chat-message-row bot" data-testid="chat-typing-indicator"><div className="chat-typing"><i /><i /><i /></div></div>}
          <div ref={messagesEnd} />
        </div>

        {session.messages.length === 1 && <div className="chat-prompts" data-testid="chat-quick-prompts">
          {QUICK_PROMPTS.map((prompt, index) => <button key={prompt} onClick={() => sendMessage(prompt)} data-testid={`chat-quick-prompt-${index + 1}`}>{prompt}</button>)}
        </div>}

        <form className="chat-input-row" onSubmit={handleSubmit} data-testid="chat-input-form">
          <label htmlFor="chat-message-input" className="sr-only">Your question</label>
          <input id="chat-message-input" value={input} onChange={event => setInput(event.target.value)} maxLength={500} placeholder="What would you like to improve?" disabled={typing} autoComplete="off" data-testid="chat-message-input" />
          <button type="submit" disabled={!input.trim() || typing} aria-label="Send message" data-testid="chat-send-button"><Send size={17} /></button>
        </form>
        <p className="chat-privacy" data-testid="chat-privacy-note">Guided help only · contact details stay in the project brief</p>
      </motion.aside>}
    </AnimatePresence>
  </>;
};