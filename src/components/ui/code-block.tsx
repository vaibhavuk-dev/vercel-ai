'use client';

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
    className?: string;
    children: React.ReactNode;
}

export function CodeBlock({ className, children }: CodeBlockProps) {
    const [isCopied, setIsCopied] = useState(false);
    const language = /language-(\w+)/.exec(className || '')?.[1] || 'text';
    const content = String(children).replace(/\n$/, '');

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(content);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="relative group rounded-lg overflow-hidden my-4 border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between px-4 py-2 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                <span className="text-xs font-medium text-zinc-500 uppercase">{language}</span>
                <button
                    onClick={copyToClipboard}
                    className="p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-zinc-500"
                    title="Copy code"
                >
                    {isCopied ? (
                        <Check className="w-4 h-4 text-green-500" />
                    ) : (
                        <Copy className="w-4 h-4" />
                    )}
                </button>
            </div>
            <div className="text-sm overflow-x-auto">
                <SyntaxHighlighter
                    language={language}
                    style={vscDarkPlus}
                    customStyle={{
                        margin: 0,
                        padding: '1.5rem',
                        background: 'transparent',
                        fontSize: 'inherit',
                    }}
                    wrapLines={true}
                    PreTag="div"
                >
                    {content}
                </SyntaxHighlighter>
            </div>
        </div>
    );
}
