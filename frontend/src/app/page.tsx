"use client";

import React, { useState, useEffect } from 'react';
import UploadSection from '@/components/UploadSection';
import ChatInterface from '@/components/ChatInterface';
import Sidebar from '@/components/Sidebar';
import DocumentViewer from '@/components/DocumentViewer';
import SettingsModal from '@/components/SettingsModal';
import { Zap, Sparkles, BrainCircuit } from 'lucide-react';

interface Message {
  role: 'user' | 'ai';
  content: string;
  time: string;
}

interface Session {
  id: string;
  title: string;
  messages: Message[];
  time: string;
  fileName?: string;
}

interface Config {
  apiKey: string;
  modelName: string;
  provider: 'groq' | 'gemini' | 'openai';
}

export default function Home() {
  const [isDocumentReady, setIsDocumentReady] = useState(false);
  const [activeFileName, setActiveFileName] = useState<string | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Global Config
  const [config, setConfig] = useState<Config>({
    apiKey: '',
    modelName: 'llama-3.3-70b-versatile',
    provider: 'groq'
  });

  useEffect(() => {
    setMounted(true);
    
    // Load Sessions
    const savedSessions = localStorage.getItem('documind_sessions');
    if (savedSessions) {
      const parsed = JSON.parse(savedSessions);
      setSessions(parsed);
      if (parsed.length > 0) {
        setActiveSessionId(parsed[0].id);
        if (parsed[0].fileName) {
          setIsDocumentReady(true);
          setActiveFileName(parsed[0].fileName);
        }
      }
    } else {
      handleNewSession();
    }

    // Load Config
    const savedConfig = localStorage.getItem('documind_config_v2'); // V2 for multi-provider
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
  }, []);

  // Save config
  const handleSaveConfig = (newConfig: Config) => {
    setConfig(newConfig);
    localStorage.setItem('documind_config_v2', JSON.stringify(newConfig));
  };

  const activeSession = sessions.find(s => s.id === activeSessionId);

  const handleNewSession = () => {
    const newId = Date.now().toString();
    const newSession: Session = {
      id: newId,
      title: "New Research Session",
      messages: [{ 
        role: 'ai', 
        content: "Welcome to DocuMind. Upload a PDF to start your research.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }],
      time: new Date().toLocaleDateString()
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newId);
    setIsDocumentReady(false);
    setActiveFileName(null);
  };

  const handleSelectSession = (id: string) => {
    setActiveSessionId(id);
    const session = sessions.find(s => s.id === id);
    if (session?.fileName) {
      setIsDocumentReady(true);
      setActiveFileName(session.fileName);
    } else {
      setIsDocumentReady(false);
      setActiveFileName(null);
    }
  };

  const handleDeleteSession = (id: string) => {
    setSessions(prev => {
      const filtered = prev.filter(s => s.id !== id);
      if (activeSessionId === id) {
        if (filtered.length > 0) {
          handleSelectSession(filtered[0].id);
        } else {
          setActiveSessionId(null);
          setIsDocumentReady(false);
          setActiveFileName(null);
        }
      }
      return filtered;
    });
  };

  const handleUploadSuccess = (fileName: string) => {
    setIsDocumentReady(true);
    setActiveFileName(fileName);
    setSessions(prev => prev.map(s => 
      s.id === activeSessionId 
        ? { ...s, fileName, title: fileName.split('.')[0] } 
        : s
    ));
  };

  const handleUpdateMessages = (newMessages: Message[]) => {
    setSessions(prev => prev.map(s => 
      s.id === activeSessionId ? { ...s, messages: newMessages } : s
    ));
  };

  if (!mounted) return <div className="min-h-screen bg-[#fcfcfd]" />;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#fcfcfd] w-full overflow-x-hidden relative">
      <Sidebar 
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewSession={handleNewSession}
        onDeleteSession={handleDeleteSession}
        activeFileName={activeFileName}
        onOpenViewer={() => setIsViewerOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />
      
      <main className="flex-1 flex flex-col min-w-0 w-full relative">
        {/* Top Navigation Bar */}
        <nav className="h-16 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-10 px-6 lg:px-8 flex items-center justify-end lg:justify-between w-full shrink-0">
          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-indigo-600 fill-indigo-600" />
              <span className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">DocuMind Engine</span>
            </div>
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">
                {config.provider === 'groq' && <Zap size={12} className="text-indigo-600" />}
                {config.provider === 'gemini' && <Sparkles size={12} className="text-indigo-600" />}
                {config.provider === 'openai' && <BrainCircuit size={12} className="text-indigo-600" />}
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{config.provider}:</span>
                <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">{config.modelName}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isDocumentReady ? 'bg-green-500' : 'bg-amber-500'}`} />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {isDocumentReady ? 'System Ready' : 'Awaiting Knowledge'}
              </span>
            </div>
          </div>
        </nav>

        <div className="p-4 md:p-8 lg:p-10 w-full max-w-[1600px] mx-auto flex-1 flex flex-col">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start w-full">
            <div className="lg:col-span-4 lg:order-2 space-y-6 w-full">
              <UploadSection onUploadSuccess={handleUploadSuccess} />
            </div>

            <div className="lg:col-span-8 lg:order-1 w-full">
              <div className="mb-6 animate-fade-in px-2">
                <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                  Knowledge <span className="text-indigo-600">Workspace</span>
                </h1>
                <p className="text-slate-400 text-[13px] font-bold mt-1 truncate">
                  {isDocumentReady ? `Analyzing ${activeFileName}` : 'Upload a document to begin.'}
                </p>
              </div>
              <div className="bg-white rounded-[2rem] lg:rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[500px] lg:h-[750px] w-full">
                <ChatInterface 
                  isReady={isDocumentReady} 
                  initialMessages={activeSession?.messages || []}
                  onUpdateMessages={handleUpdateMessages}
                  key={activeSessionId}
                  config={config}
                />
              </div>
            </div>
          </div>

          <footer className="mt-12 py-8 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-4 opacity-60">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">© 2026 DocuMind AI</p>
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <span>Developed by</span>
              <a href="http://www.linkedin.com/in/john-felix-jf" target="_blank" className="text-indigo-600">John Felix</a>
            </div>
          </footer>
        </div>
      </main>

      <DocumentViewer isOpen={isViewerOpen} onClose={() => setIsViewerOpen(false)} fileName={activeFileName || ""} />
      
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        config={config} 
        onSave={handleSaveConfig} 
      />
    </div>
  );
}
