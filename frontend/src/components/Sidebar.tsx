"use client";

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Search,
  History,
  FileText,
  Clock,
  Trash2,
  Activity,
  Zap,
  Maximize2,
  Menu,
  X,
  Settings
} from 'lucide-react';

interface Session {
  id: string;
  title: string;
  time: string;
  fileName?: string;
}

interface SidebarProps {
  sessions: Session[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onDeleteSession: (id: string) => void;
  activeFileName: string | null;
  onOpenViewer: () => void;
  onOpenSettings: () => void;
}

export default function Sidebar({ 
  sessions = [], 
  activeSessionId = null, 
  onSelectSession = () => {}, 
  onNewSession = () => {}, 
  onDeleteSession = () => {},
  activeFileName = null,
  onOpenViewer = () => {},
  onOpenSettings = () => {}
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSessions = sessions.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (id: string) => {
    onSelectSession(id);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Toggle */}
      <div className="lg:hidden fixed top-6 left-6 z-50">
        <button 
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-3 bg-white border border-slate-100 rounded-2xl shadow-xl text-slate-600 hover:text-indigo-600 active:scale-95 transition-all flex items-center justify-center"
        >
          {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Backdrop */}
      <div 
        className={`lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity duration-500 ${
          isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileOpen(false)}
      />

      {/* Sidebar Content */}
      <aside 
        className={`bg-white border-r border-slate-100 flex flex-col h-screen transition-all duration-500 ease-in-out shrink-0 z-40
          ${isCollapsed ? 'lg:w-20' : 'lg:w-72'}
          ${isMobileOpen ? 'translate-x-0 w-[280px] fixed left-0 shadow-2xl' : 'lg:translate-x-0 -translate-x-full fixed lg:sticky top-0'}
        `}
      >
        {/* Toggle Button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-3 top-10 w-6 h-6 bg-white border border-slate-100 rounded-full items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 shadow-sm transition-all z-50"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Header / Brand */}
        <div className={`p-8 pb-6 ${isCollapsed && !isMobileOpen ? 'px-6' : ''}`}>
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-100 group-hover:rotate-12 transition-all duration-500 shrink-0">
              <Sparkles size={20} className="text-white" />
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="flex flex-col animate-fade-in">
                <h1 className="font-black text-slate-900 text-xl tracking-tight leading-none">DocuMind</h1>
                <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-[0.2em] mt-1">Intelligence</span>
              </div>
            )}
          </div>
        </div>

        {/* New Chat Button */}
        <div className="px-4 mb-4">
          <button 
            onClick={onNewSession}
            className={`w-full bg-slate-900 text-white rounded-2xl flex items-center gap-3 transition-all hover:bg-slate-800 active:scale-95 shadow-lg shadow-slate-200 ${
              isCollapsed && !isMobileOpen ? 'justify-center p-3' : 'px-4 py-3.5'
            }`}
          >
            <Plus size={18} />
            {(!isCollapsed || isMobileOpen) && <span className="text-xs font-black uppercase tracking-widest animate-fade-in">New Session</span>}
          </button>
        </div>

        {/* Search Bar */}
        {(!isCollapsed || isMobileOpen) && (
          <div className="px-4 mb-6 animate-fade-in">
            <div className="relative group">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-transparent focus:border-indigo-100 focus:bg-white px-10 py-2.5 rounded-xl text-xs font-bold text-slate-600 outline-none transition-all placeholder:text-slate-400"
              />
            </div>
          </div>
        )}

        {/* Main Navigation */}
        <nav className="px-4 space-y-1 mb-4">
          <a 
            href="#" 
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 font-bold text-sm bg-indigo-50 text-indigo-600 group relative`}
          >
            <MessageSquare size={18} className="shrink-0" />
            {(!isCollapsed || isMobileOpen) && <span className="flex-1 animate-fade-in">Workspace</span>}
            {(isCollapsed && !isMobileOpen) ? (
              <div className="absolute left-0 w-1 h-6 bg-indigo-600 rounded-r-full" />
            ) : (
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            )}
          </a>
          
          <button 
            onClick={onOpenSettings}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 font-bold text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-900 group relative ${isCollapsed && !isMobileOpen ? 'justify-center' : ''}`}
          >
            <Settings size={18} className="shrink-0 group-hover:rotate-45 transition-transform duration-500" />
            {(!isCollapsed || isMobileOpen) && <span className="flex-1 text-left animate-fade-in">Settings</span>}
          </button>
        </nav>

        {/* History Section */}
        {(!isCollapsed || isMobileOpen) && (
          <div className="flex-1 px-4 space-y-6 overflow-y-auto scrollbar-hide animate-fade-in pb-10">
            <div>
              <div className="flex items-center justify-between px-4 mb-4">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <History size={12} />
                  <span>Recent Sessions</span>
                </div>
                <Activity size={12} className="text-slate-300" />
              </div>
              <div className="space-y-1">
                {filteredSessions.map((session) => (
                  <div 
                    key={session.id} 
                    onClick={() => handleSelect(session.id)}
                    className={`group flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all border ${
                      activeSessionId === session.id 
                        ? 'bg-slate-50 border-slate-100' 
                        : 'border-transparent hover:bg-slate-50/50 hover:border-slate-50'
                    }`}
                  >
                    <Clock size={14} className={`shrink-0 ${activeSessionId === session.id ? 'text-indigo-600' : 'text-slate-300 group-hover:text-indigo-400'}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-[11px] font-bold truncate ${activeSessionId === session.id ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-800'}`}>
                        {session.title}
                      </p>
                      <p className="text-[9px] text-slate-400 font-medium mt-0.5">{session.time}</p>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDeleteSession(session.id); }}
                      className="p-1.5 hover:bg-red-50 rounded-lg text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
               <div className="flex items-center gap-2 px-4 mb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <FileText size={12} />
                <span>Active Assets</span>
              </div>
              <div className="px-4">
                {activeFileName ? (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-indigo-100 flex flex-col gap-3 group transition-all animate-fade-in">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-8 h-8 bg-white rounded-lg border border-slate-100 flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                          <Zap size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-black text-slate-800 truncate">{activeFileName}</p>
                          <p className="text-[9px] text-green-500 font-bold uppercase tracking-widest">Ready</p>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onOpenViewer(); }}
                        className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-indigo-600 transition-all border border-transparent hover:border-slate-100 shadow-sm"
                      >
                        <Maximize2 size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center py-6 text-center">
                    <FileText size={16} className="text-slate-300 mb-2" />
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">No document<br/>active</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className={`p-6 border-t border-slate-50 ${isCollapsed && !isMobileOpen ? 'flex justify-center' : ''}`}>
           <div className={`flex items-center gap-3 px-2 py-1.5 bg-slate-50 rounded-xl border border-slate-100 ${isCollapsed && !isMobileOpen ? 'justify-center' : ''}`}>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              {(!isCollapsed || isMobileOpen) && <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Cloud Sync Active</span>}
           </div>
        </div>
      </aside>
    </>
  );
}
