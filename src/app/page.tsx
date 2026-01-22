'use client';

import { useChat } from '@ai-sdk/react';
import { Send, Bot, User, Sparkles, Trash, Square, RefreshCw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import TextareaAutosize from 'react-textarea-autosize';
import { CodeBlock } from '@/components/ui/code-block';

export default function Chat() {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const { messages, append, isLoading, setMessages, stop, reload } = useChat() as any;
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    await append({ role: 'user', content: input });
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto bg-background text-foreground">
      <header className="flex items-center gap-2 p-4 border-b border-border/10 bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <div className="p-2 rounded-lg bg-primary/10">
          <Sparkles className="w-5 h-5 text-blue-500" />
        </div>
        <h1 className="text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          AI Assistant
        </h1>
        <div className="flex-1" />
        <button
          onClick={() => setMessages([])}
          className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500 hover:text-red-500"
          title="Clear Chat"
        >
          <Trash className="w-5 h-5" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-8">
            <div className="flex flex-col items-center space-y-4 opacity-50">
              <Bot className="w-12 h-12" />
              <p className="text-lg font-medium">How can I help you today?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg w-full px-4">
              {[
                'Explain quantum physics',
                'Write a haiku about code',
                'What are the latest AI trends?',
                'Help me debug a React component'
              ].map((question) => (
                <button
                  key={question}
                  onClick={() => append({ role: 'user', content: question })}
                  className="p-4 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-sm text-left shadow-sm"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m: any) => (
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
              <div className="prose dark:prose-invert max-w-none text-sm">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      const isInline = !match;

                      if (isInline) {
                        return (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      }

                      return (
                        <CodeBlock className={className}>
                          {children}
                        </CodeBlock>
                      );
                    },
                  }}
                >
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {(m as any).content || (m as any).parts?.map((p: any) => p.type === 'text' ? p.text : '').join('')}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
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
        {!isLoading && messages.length > 0 && messages[messages.length - 1]?.role === 'assistant' && (
          <div className="flex justify-center">
            <button
              onClick={() => reload()}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Regenerate response
            </button>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      <div className="p-4 border-t border-border/10 bg-background/80 backdrop-blur-md sticky bottom-0 z-10">
        <form onSubmit={handleSubmit} className="relative flex items-end">
          <TextareaAutosize
            className="w-full p-4 pr-12 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-sm resize-none"
            value={input}
            placeholder="Say something..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            minRows={1}
            maxRows={6}
          />
          <button
            type={isLoading ? 'button' : 'submit'}
            onClick={isLoading ? () => stop() : undefined}
            disabled={!isLoading && !input.trim()}
            className="absolute right-2 top-2 p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <Square className="w-5 h-5 fill-current" />
                <span className="sr-only">Stop generation</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span className="sr-only">Send</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
