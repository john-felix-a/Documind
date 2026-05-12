"use client";

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, User, Loader2, MessageSquare, Sparkles, Trash2, Copy, Check, Lightbulb, ArrowRight, MoreHorizontal, Lock } from 'lucide-react';

interface Message {
  role: 'user' | 'ai';
  content: string;
  time: string;
}

interface ChatInterfaceProps {
  isReady: boolean;
  initialMessages: Message[];
  onUpdateMessages: (messages: Message[]) => void;
  config: {
    apiKey: string;
    modelName: string;
    provider: string;
  };
}

export default function ChatInterface({ isReady, initialMessages, onUpdateMessages, config }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "Summarize this document",
    "What are the key takeaways?",
    "List the main requirements",
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update parent when messages change
  useEffect(() => {
    if (mounted && messages.length > 0) {
      onUpdateMessages(messages);
    }
  }, [messages, mounted]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (mounted) {
      scrollToBottom();
    }
  }, [messages, mounted]);

  const handleSend = async (text?: string) => {
    if (!isReady) return;
    const messageToSend = text || input;
    if (!messageToSend.trim() || loading) return;

    const userMessage = messageToSend.trim();
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage, time: now }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await axios.post(`${apiBaseUrl}/chat`, {
        question: userMessage,
        api_key: config.apiKey,
        model_name: config.modelName,
        provider: config.provider
      });
      const aiResponse: Message = { 
        role: 'ai', 
        content: response.data.answer,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...newMessages, aiResponse]);
    } catch (error: any) {
      console.error('Chat failed:', error);
      const errorResponse: Message = { 
        role: 'ai', 
        content: 'Connection error. Please check if the backend is running.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...newMessages, errorResponse]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const clearChat = () => {
    if (messages.length > 1) {
      setMessages([messages[0]]);
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Locked Overlay if not ready */}
      {!isReady && (
        <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-[2px] flex items-center justify-center p-12 text-center animate-fade-in">
          <div className="max-w-xs flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-300 mb-6 shadow-inner border border-slate-100">
              <Lock size={28} />
            </div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight mb-2">Workspace Locked</h3>
            <p className="text-xs text-slate-400 font-bold leading-relaxed mb-8">
              The AI engine is awaiting knowledge. Please upload a PDF to unlock document interaction.
            </p>
            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl shadow-sm">
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Awaiting PDF Source</span>
            </div>
          </div>
        </div>
      )}

      {/* HEADER & INPUT AT TOP */}
      <div className={`p-6 border-b border-slate-50 space-y-6 bg-white/50 backdrop-blur-md z-10 ${!isReady ? 'opacity-20 pointer-events-none' : ''}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-sm tracking-tight">DocuMind Engine</h3>
              <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                Active Analysis
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <button 
              onClick={clearChat}
              className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-red-500 transition-all duration-300"
              title="Reset View"
            >
              <Trash2 size={18} />
            </button>
            <button className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 transition-all duration-300">
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>

        {/* INPUT AREA AT TOP */}
        <div className="relative group">
          <div className="absolute inset-0 bg-indigo-500/5 blur-xl group-focus-within:bg-indigo-500/10 transition-all" />
          <div className="relative flex items-center gap-3 p-2 bg-white border border-slate-100 rounded-[1.5rem] shadow-sm group-focus-within:border-indigo-200 transition-all">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything about your documents..."
              className="flex-1 bg-transparent px-5 py-3 outline-none text-sm font-semibold text-slate-700 placeholder:text-slate-300"
              disabled={loading || !isReady}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading || !isReady}
              className={`w-10 h-10 rounded-[1rem] flex items-center justify-center transition-all ${
                !input.trim() || loading || !isReady
                  ? 'bg-slate-50 text-slate-200' 
                  : 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:scale-105 active:scale-95'
              }`}
            >
              <Send size={16} />
            </button>
          </div>
        </div>

        {/* SUGGESTIONS RIGHT UNDER INPUT */}
        {!loading && isReady && (
          <div className="flex flex-wrap gap-2 animate-fade-in">
            {suggestions.map((s, i) => (
              <button 
                key={i}
                onClick={() => handleSend(s)}
                className="px-3 py-1.5 bg-slate-50/50 border border-slate-100 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 transition-all flex items-center gap-2 group shadow-sm"
              >
                {s}
                <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* MESSAGES AREA BELOW INPUT */}
      <div className={`flex-1 overflow-y-auto px-6 py-8 space-y-8 scrollbar-hide ${!isReady ? 'opacity-20 pointer-events-none' : ''}`}>
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
            <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-100 text-indigo-600'
              }`}>
                {msg.role === 'user' ? <User size={18} /> : <Sparkles size={18} />}
              </div>
              <div className="space-y-2">
                <div className={`p-5 rounded-3xl ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-slate-50/50 border border-slate-100 text-slate-700 rounded-tl-none'
                }`}>
                  <p className="text-[13.5px] leading-relaxed font-semibold whitespace-pre-wrap">{msg.content}</p>
                </div>
                <div className={`flex items-center gap-3 px-1 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">{msg.time}</span>
                  {msg.role === 'ai' && (
                    <button 
                      onClick={() => copyToClipboard(msg.content, index)}
                      className="text-slate-300 hover:text-indigo-600 transition-colors flex items-center gap-1"
                    >
                      {copiedIndex === index ? <Check size={10} /> : <Copy size={10} />}
                      <span className="text-[9px] font-black uppercase tracking-widest">{copiedIndex === index ? 'Copied' : 'Copy'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start animate-pulse">
            <div className="flex gap-4">
              <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 text-indigo-400">
                <Loader2 size={18} className="animate-spin" />
              </div>
              <div className="p-5 bg-slate-50/50 border border-slate-100 rounded-3xl rounded-tl-none min-w-[140px]">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.2em]">DocuMind Thinking</span>
                </div>
                <div className="space-y-2">
                  <div className="h-1.5 w-32 bg-slate-200 rounded-full animate-shimmer" />
                  <div className="h-1.5 w-24 bg-slate-200 rounded-full animate-shimmer" />
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-slate-50 flex justify-center">
        <p className="text-[9px] text-slate-300 font-black uppercase tracking-[0.3em]">
          End-to-End Encrypted Knowledge Session • Sync Active
        </p>
      </div>
    </div>
  );
}
