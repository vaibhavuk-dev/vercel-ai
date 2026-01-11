'use client';

import { useChat } from '@ai-sdk/react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto bg-background text-foreground">
      <header className="flex items-center gap-2 p-4 border-b border-border/10 bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <div className="p-2 rounded-lg bg-primary/10">
          <Sparkles className="w-5 h-5 text-blue-500" />
        </div>
        <h1 className="text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          AI Assistant
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
            <Bot className="w-12 h-12" />
            <p className="text-lg font-medium">How can I help you today?</p>
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''
              }`}
          >
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${m.role === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-zinc-200 dark:bg-zinc-800'
                }`}
            >
              {m.role === 'user' ? (
                <User className="w-5 h-5" />
              ) : (
                <Bot className="w-5 h-5" />
              )}
            </div>

            <div
              className={`p-4 rounded-2xl max-w-[80%] shadow-sm ${m.role === 'user'
                ? 'bg-blue-500 text-white rounded-br-none'
                : 'bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-bl-none'
                }`}
            >
              <p className="leading-relaxed whitespace-pre-wrap">{m.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-bl-none">
              <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce inline-block mr-1"></span>
              <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce inline-block mr-1 delay-100"></span>
              <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce inline-block delay-200"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      <div className="p-4 border-t border-border/10 bg-background/80 backdrop-blur-md sticky bottom-0 z-10">
        <form onSubmit={handleSubmit} className="relative">
          <input
            className="w-full p-4 pr-12 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-sm"
            value={input}
            placeholder="Say something..."
            onChange={handleInputChange}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-2 p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
            <span className="sr-only">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
