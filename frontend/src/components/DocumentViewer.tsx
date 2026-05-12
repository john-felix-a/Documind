"use client";

import React from 'react';
import { X, ExternalLink, Maximize2, Download } from 'lucide-react';

interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
}

export default function DocumentViewer({ isOpen, onClose, fileName }: DocumentViewerProps) {
  if (!isOpen) return null;

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const fileUrl = `${apiBaseUrl}/view/${fileName}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-10 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full h-full bg-white rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-zoom-in">
        {/* Header */}
        <div className="px-8 py-4 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <Maximize2 size={20} />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-sm tracking-tight">{fileName}</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Internal Document Viewer</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <a 
              href={fileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-indigo-600 transition-all"
              title="Open in new tab"
            >
              <ExternalLink size={20} />
            </a>
            <a 
              href={fileUrl} 
              download
              className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-indigo-600 transition-all"
              title="Download PDF"
            >
              <Download size={20} />
            </a>
            <div className="w-px h-6 bg-slate-100 mx-1" />
            <button 
              onClick={onClose}
              className="p-2.5 hover:bg-red-50 rounded-xl text-slate-400 hover:text-red-500 transition-all"
              title="Close Viewer"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* PDF Iframe */}
        <div className="flex-1 bg-slate-100 p-6">
          <div className="w-full h-full bg-white rounded-2xl shadow-inner overflow-hidden border border-slate-200">
            <iframe 
              src={fileUrl} 
              className="w-full h-full border-none"
              title="PDF Document"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
