'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! 👋 How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isWhatsAppConnected, setIsWhatsAppConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, isBotTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsBotTyping(true);

    // Send message to WhatsApp business account
    if (isWhatsAppConnected) {
      // In a real implementation, you would send the message to your backend
      // which would then forward it to WhatsApp
      console.log('Sending message to WhatsApp:', inputValue);
      
      // Simulate successful send to WhatsApp
      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "Your message has been sent to our WhatsApp business account. Our team will respond to you shortly.",
          sender: 'bot',
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, botMessage]);
        setIsBotTyping(false);
      }, 1000);
    } else {
      // Simulate bot response after a delay
      setTimeout(() => {
        const botResponses = [
          "Thanks for your message! Our team will get back to you shortly.",
          "I've noted your inquiry. One of our specialists will contact you soon.",
          "Great question! I've forwarded this to our support team.",
          "I appreciate you reaching out. We'll respond as soon as possible.",
          "Thanks for getting in touch! We typically respond within 24 hours.",
          "I've received your message and will have someone assist you shortly."
        ];

        const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: randomResponse,
          sender: 'bot',
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, botMessage]);
        setIsBotTyping(false);
      }, 1500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="fixed bottom-6 right-6 z-[99998]"
      >
        <Button
          className="w-14 h-14 rounded-full shadow-2xl bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MessageCircle className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-24 right-6 w-full max-w-md h-[500px] z-[99998]"
          >
            <div className="bg-card rounded-2xl shadow-2xl border border-primary/10 flex flex-col h-full overflow-hidden">
              {/* Chat Header */}
              <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary-foreground/20 p-2 rounded-full">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-headline font-bold">Live Chat</h3>
                    <p className="text-xs opacity-80">We're online and ready to help</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isWhatsAppConnected && (
                    <div className="flex items-center gap-1 text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded-full">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      WhatsApp Connected
                    </div>
                  )}
                  <Button
                    className="text-primary-foreground hover:bg-primary-foreground/20"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 bg-background/50">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={cn(
                        'flex gap-3',
                        message.sender === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      {message.sender === 'bot' && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Bot className="w-4 h-4 text-primary" />
                        </div>
                      )}
                      <div
                        className={cn(
                          'max-w-[80%] rounded-2xl px-4 py-2',
                          message.sender === 'user'
                            ? 'bg-primary text-primary-foreground rounded-tr-none'
                            : 'bg-muted text-foreground rounded-tl-none'
                        )}
                      >
                        <p className="text-sm">{message.text}</p>
                      </div>
                      {message.sender === 'user' && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {isBotTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-3 justify-start"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-primary" />
                      </div>
                      <div className="bg-muted text-foreground rounded-2xl rounded-tl-none px-4 py-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </div>
              
              {/* WhatsApp Connection Banner */}
              {!isWhatsAppConnected && (
                <div className="px-4 pb-2">
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-center">
                    <p className="text-sm text-yellow-500 mb-2">
                      Connect to WhatsApp for real-time messaging
                    </p>
                    <Button
                      className="w-full bg-yellow-500 hover:bg-yellow-500/90 text-yellow-900 text-sm font-medium"
                      onClick={() => setIsWhatsAppConnected(true)}
                    >
                      Connect WhatsApp
                    </Button>
                  </div>
                </div>
              )}

              {/* Chat Input */}
              <div className="p-4 border-t border-primary/10">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Type your message..."
                      className="w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 max-h-24"
                      rows={1}
                      style={{ minHeight: '44px' }}
                    />
                  </div>
                  <Button
                    className="h-12 w-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0"
                    onClick={handleSendMessage}
                    disabled={inputValue.trim() === ''}
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Powered by AI • Typically responds in under 2 minutes
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}