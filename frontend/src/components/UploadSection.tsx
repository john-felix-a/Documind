"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { Cloud, FileText, CheckCircle, AlertCircle, Loader2, ArrowUpCircle, X } from 'lucide-react';

interface UploadSectionProps {
  onUploadSuccess: (fileName: string) => void;
}

export default function UploadSection({ onUploadSuccess }: UploadSectionProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setStatus(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await axios.post(`${apiBaseUrl}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setStatus({ type: 'success', message: 'Knowledge base updated successfully!' });
      onUploadSuccess(file.name); // Pass the filename
      setFile(null);
    } catch (error: any) {
      console.error('Upload failed:', error);
      setStatus({ 
        type: 'error', 
        message: 'Could not process PDF. Please try again.' 
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="animate-slide-up">
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="p-8 pb-0">
          <h2 className="text-xl font-black text-slate-900 tracking-tight mb-1">Knowledge Source</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Connect your PDF data</p>
        </div>
        
        <div className="p-8">
          <div className={`relative group border-2 border-dashed rounded-[1.5rem] transition-all duration-500 overflow-hidden ${
            file 
              ? 'border-indigo-400 bg-indigo-50/10' 
              : 'border-slate-100 hover:border-indigo-100 hover:bg-slate-50/50'
          }`}>
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
              {file ? (
                <div className="animate-fade-in flex flex-col items-center">
                  <div className="w-16 h-16 bg-white shadow-xl shadow-indigo-50 rounded-2xl flex items-center justify-center mb-4 text-indigo-600 relative">
                    <FileText size={28} />
                    <button 
                      onClick={(e) => { e.stopPropagation(); setFile(null); }}
                      className="absolute -top-2 -right-2 bg-white text-slate-400 hover:text-red-500 shadow-md rounded-full p-1 transition-colors border border-slate-50"
                    >
                      <X size={12} />
                    </button>
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 max-w-xs truncate px-4">{file.name}</h3>
                  <div className="mt-4 px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-full uppercase tracking-widest">
                    Ready to Index
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-slate-300 group-hover:text-indigo-400 transition-colors">
                    <Cloud size={28} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 mb-1">Upload PDF Document</h3>
                  <p className="text-[11px] text-slate-400 font-medium px-10">Select a file to begin the intelligence processing.</p>
                </>
              )}
            </div>

            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
              accept=".pdf" 
              onChange={handleFileChange} 
              disabled={uploading} 
            />
          </div>

          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className={`w-full mt-6 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 flex items-center justify-center gap-3 ${
              !file || uploading
                ? 'bg-slate-50 text-slate-300 cursor-not-allowed border border-slate-100'
                : 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95'
            }`}
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <ArrowUpCircle size={18} />
                <span>Analyze File</span>
              </>
            )}
          </button>

          {status && (
            <div className={`mt-6 p-4 rounded-2xl flex items-center gap-3 animate-fade-in ${
              status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
            }`}>
              {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              <p className="text-[11px] font-bold">{status.message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
