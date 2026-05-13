'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import styles from './ChatbotWidget.module.css';

const QUICK_ACTIONS = [
  { label: '🌱 Volunteer', text: 'I want to volunteer for an upcoming event' },
  { label: '💰 Donate', text: 'I want to donate to Khaana Bank Trust' },
  { label: '📅 Events', text: 'What upcoming events do you have?' },
  { label: '📝 About', text: 'Tell me about Khaana Bank Trust' },
];

const ACTION_LABELS = {
  REGISTER_VOLUNTEER: { icon: '🙋', title: 'Volunteer Registration', verb: 'register' },
  INITIATE_DONATION: { icon: '💰', title: 'Donation', verb: 'proceed' },
  SUBSCRIBE_USER: { icon: '📬', title: 'Subscribe to Updates', verb: 'subscribe' },
  GENERATE_BLOG_DRAFT: { icon: '📝', title: 'Save Blog Draft', verb: 'save' },
};

function formatTime(date) {
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function renderActionDataSummary(action) {
  if (!action?.data) return null;
  const d = action.data;
  const lines = [];
  if (d.name) lines.push(`Name: ${d.name}`);
  if (d.email) lines.push(`Email: ${d.email}`);
  if (d.phone) lines.push(`Phone: ${d.phone}`);
  if (d.eventType) lines.push(`Event: ${d.eventType}`);
  if (d.preferredDate) lines.push(`Date: ${d.preferredDate}`);
  if (d.suggestedAmount) lines.push(`Amount: ₹${d.suggestedAmount}`);
  if (d.cause) lines.push(`Cause: ${d.cause}`);
  if (d.frequency) lines.push(`Frequency: ${d.frequency}`);
  if (d.title) lines.push(`Title: ${d.title}`);
  if (d.category) lines.push(`Category: ${d.category}`);
  return lines;
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [actionProcessing, setActionProcessing] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const pathname = usePathname();

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 400);
    }
  }, [isOpen]);

  // Show welcome message on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: 'bot',
          text: "Namaste! 🙏 I'm **Khaana Bot**, the AI assistant for Khaana Bank Trust.\n\nI can help you with:\n• 🌱 Volunteering for events\n• 💰 Making donations\n• 📅 Finding upcoming events\n• 📝 Learning about our mission\n\nHow can I help you today?",
          time: new Date(),
          isWelcome: true,
        },
      ]);
    }
  }, [isOpen, messages.length]);

  function handleOpen() {
    setIsOpen(true);
    setIsClosing(false);
    setHasUnread(false);
  }

  function handleClose() {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 250);
  }

  function toggleChat() {
    if (isOpen) handleClose();
    else handleOpen();
  }

  // Build conversation history for API
  function getHistory() {
    return messages
      .filter(m => !m.isWelcome && !m.isError)
      .map(m => ({ role: m.role === 'bot' ? 'model' : 'user', text: m.text }));
  }

  async function sendMessage(text) {
    const trimmed = (text || input).trim();
    if (!trimmed || isLoading) return;

    const userMsg = { role: 'user', text: trimmed, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setPendingAction(null);

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: getHistory(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      const botMsg = {
        role: 'bot',
        text: data.message || "I'm sorry, I couldn't process that. Please try again.",
        time: new Date(),
      };
      setMessages(prev => [...prev, botMsg]);

      // Handle action if present
      if (data.action && data.action.actionRequired) {
        setPendingAction(data.action);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'bot',
          text: err.message || 'Sorry, something went wrong. Please try again later. 🙏',
          time: new Date(),
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleConfirmAction() {
    if (!pendingAction || actionProcessing) return;
    setActionProcessing(true);

    const { actionType, data } = pendingAction;

    try {
      let result = null;

      switch (actionType) {
        case 'REGISTER_VOLUNTEER': {
          const res = await fetch('/api/volunteer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: data.name,
              email: data.email,
              phone: data.phone,
              eventType: data.eventType || 'General',
              preferredDate: data.preferredDate || 'flexible',
              message: data.message || '',
            }),
          });
          result = await res.json();
          if (!res.ok) throw new Error(result.error || 'Registration failed');

          setMessages(prev => [
            ...prev,
            {
              role: 'bot',
              text: `✅ **Registration Successful!**\n\n${result.message}${result.emailSent ? '\n\n📧 A confirmation email has been sent to your email address.' : ''}`,
              time: new Date(),
            },
          ]);
          break;
        }

        case 'INITIATE_DONATION': {
          setMessages(prev => [
            ...prev,
            {
              role: 'bot',
              text: `💝 **Redirecting to Donation Page...**\n\nYou'll be taken to our secure donation page where you can complete your donation of ₹${data.suggestedAmount || ''} via Razorpay.\n\nThank you for your generosity! 🙏`,
              time: new Date(),
            },
          ]);
          setTimeout(() => {
            window.location.href = '/support';
          }, 1500);
          break;
        }

        case 'SUBSCRIBE_USER': {
          const res = await fetch('/api/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: data.name,
              email: data.email,
              phone: data.phone,
              captchaToken: 'chatbot-verified',
            }),
          });
          result = await res.json();
          if (!res.ok && res.status !== 200) throw new Error(result.error || 'Subscription failed');

          setMessages(prev => [
            ...prev,
            {
              role: 'bot',
              text: `✅ **${result.message || 'Subscribed successfully!'}**\n\nYou'll now receive updates about our events, blogs, and volunteer opportunities. Welcome to the Khaana Bank family! 🎉`,
              time: new Date(),
            },
          ]);
          break;
        }

        case 'GENERATE_BLOG_DRAFT': {
          const res = await fetch('/api/chatbot/blog-draft', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: data.title,
              content: data.content,
              category: data.category || 'General',
              summary: data.summary || '',
              imageDescription: data.imageDescription || '',
            }),
          });
          result = await res.json();
          if (!res.ok) throw new Error(result.error || 'Failed to save draft');

          setMessages(prev => [
            ...prev,
            {
              role: 'bot',
              text: `✅ **Blog Draft Saved!**\n\nThe draft "${data.title}" has been saved to the admin panel for review and publishing. 📝`,
              time: new Date(),
            },
          ]);
          break;
        }

        default:
          setMessages(prev => [
            ...prev,
            {
              role: 'bot',
              text: "I'm not sure how to handle this action. Please contact the team directly. 🙏",
              time: new Date(),
            },
          ]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'bot',
          text: `❌ ${err.message || 'Something went wrong while processing. Please try again or contact us at +91 8840775823.'} 🙏`,
          time: new Date(),
          isError: true,
        },
      ]);
    } finally {
      setPendingAction(null);
      setActionProcessing(false);
    }
  }

  function handleCancelAction() {
    setPendingAction(null);
    setMessages(prev => [
      ...prev,
      {
        role: 'bot',
        text: 'No worries! The action has been cancelled. Feel free to ask me anything else. 😊',
        time: new Date(),
      },
    ]);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function handleQuickAction(text) {
    sendMessage(text);
  }

  // Simple markdown-lite renderer for bold and newlines
  function renderText(text) {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      // Split by newlines
      const lines = part.split('\n');
      return lines.map((line, j) => (
        <span key={`${i}-${j}`}>
          {j > 0 && <br />}
          {line}
        </span>
      ));
    });
  }

  // Don't render on admin pages
  if (pathname?.startsWith('/admin')) return null;

  return (
    <>
      {/* Floating Action Button */}
      <button
        className={`${styles.fabButton} ${isOpen ? styles.open : ''}`}
        onClick={toggleChat}
        aria-label={isOpen ? 'Close chat' : 'Open chat assistant'}
        id="chatbot-fab"
      >
        <span className={styles.fabIcon}>{isOpen ? '✕' : '💬'}</span>
        {hasUnread && !isOpen && <span className={styles.unreadBadge}>1</span>}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className={`${styles.chatPanel} ${isClosing ? styles.chatPanelClosing : ''}`} role="dialog" aria-label="Khaana Bot Chat">
          {/* Header */}
          <div className={styles.chatHeader}>
            <div className={styles.headerAvatar}>🤖</div>
            <div className={styles.headerInfo}>
              <div className={styles.headerTitle}>Khaana Bot</div>
              <div className={styles.headerSubtitle}>
                <span className={styles.onlineDot}></span>
                AI Assistant • Khaana Bank Trust
              </div>
            </div>
            <button className={styles.closeBtn} onClick={handleClose} aria-label="Close chat">✕</button>
          </div>

          {/* Messages */}
          <div className={styles.messagesArea} id="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`${styles.messageRow} ${msg.role === 'user' ? styles.messageRowUser : styles.messageRowBot}`}>
                {msg.role === 'bot' && <div className={styles.botAvatarSmall}>🤖</div>}
                <div>
                  <div className={`${styles.messageBubble} ${msg.role === 'user' ? styles.userBubble : msg.isError ? styles.errorBubble : styles.botBubble}`}>
                    {renderText(msg.text)}
                  </div>
                  <div className={styles.messageTime}>{formatTime(msg.time)}</div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className={styles.typingRow}>
                <div className={styles.botAvatarSmall}>🤖</div>
                <div className={styles.typingDots}>
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}

            {/* Action Confirmation Card */}
            {pendingAction && (
              <div className={styles.actionCard}>
                <div className={styles.actionCardHeader}>
                  <span className={styles.actionCardIcon}>
                    {ACTION_LABELS[pendingAction.actionType]?.icon || '⚡'}
                  </span>
                  <span className={styles.actionCardTitle}>
                    {ACTION_LABELS[pendingAction.actionType]?.title || 'Confirm Action'}
                  </span>
                </div>
                <div className={styles.actionCardBody}>
                  {renderActionDataSummary(pendingAction)?.map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
                <div className={styles.actionBtns}>
                  <button
                    className={styles.confirmBtn}
                    onClick={handleConfirmAction}
                    disabled={actionProcessing}
                  >
                    {actionProcessing
                      ? 'Processing...'
                      : `✓ Yes, ${ACTION_LABELS[pendingAction.actionType]?.verb || 'confirm'}`}
                  </button>
                  <button
                    className={styles.cancelBtn}
                    onClick={handleCancelAction}
                    disabled={actionProcessing}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Chips */}
          {messages.length <= 1 && !isLoading && (
            <div className={styles.quickActions}>
              {QUICK_ACTIONS.map((qa, idx) => (
                <button
                  key={idx}
                  className={styles.quickChip}
                  onClick={() => handleQuickAction(qa.text)}
                >
                  {qa.label}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className={styles.inputArea}>
            <input
              ref={inputRef}
              type="text"
              className={styles.chatInput}
              placeholder="Type your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              maxLength={2000}
              id="chatbot-input"
            />
            <button
              className={styles.sendBtn}
              onClick={() => sendMessage()}
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
              id="chatbot-send"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
