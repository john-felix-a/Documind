"use client";

import React, { useState, useEffect } from 'react';
import { X, Settings, Key, Cpu, ShieldCheck, Save, RefreshCcw, Box, Sparkles, Zap, BrainCircuit } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: {
    apiKey: string;
    modelName: string;
    provider: 'groq' | 'gemini' | 'openai';
  };
  onSave: (config: { apiKey: string; modelName: string; provider: 'groq' | 'gemini' | 'openai' }) => void;
}

const PROVIDERS = [
  { id: 'groq', name: 'Groq', icon: <Zap size={14} />, desc: 'Ultra-fast Llama models' },
  { id: 'gemini', name: 'Gemini', icon: <Sparkles size={14} />, desc: 'Google Google AI' },
  { id: 'openai', name: 'OpenAI', icon: <BrainCircuit size={14} />, desc: 'GPT-4o & more' },
];

const MODELS_BY_PROVIDER = {
  groq: [
    { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B", speed: "Fast", reasoning: "High" },
    { id: "llama3-8b-8192", name: "Llama 3 8B", speed: "Instant", reasoning: "Standard" },
    { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B", speed: "Balanced", reasoning: "High" },
  ],
  gemini: [
    { id: "gemini-1.5-pro-latest", name: "Gemini 1.5 Pro", speed: "Fast", reasoning: "Superior" },
    { id: "gemini-1.5-flash-latest", name: "Gemini 1.5 Flash", speed: "Instant", reasoning: "Balanced" },
  ],
  openai: [
    { id: "gpt-4o", name: "GPT-4o", speed: "Fast", reasoning: "Superior" },
    { id: "gpt-4o-mini", name: "GPT-4o Mini", speed: "Instant", reasoning: "Balanced" },
    { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", speed: "Fast", reasoning: "Standard" },
  ]
};

export default function SettingsModal({ isOpen, onClose, config, onSave }: SettingsModalProps) {
  const [apiKey, setApiKey] = useState(config.apiKey);
  const [modelName, setModelName] = useState(config.modelName);
  const [provider, setProvider] = useState(config.provider);
  const [showKey, setShowKey] = useState(false);

  // Sync state if config changes
  useEffect(() => {
    if (isOpen) {
      setApiKey(config.apiKey);
      setProvider('groq'); // Always preselect Groq for now
      setModelName(config.modelName || 'llama-3.3-70b-versatile');
    }
  }, [isOpen, config]);

  // When provider changes, select the first model of that provider
  useEffect(() => {
    const models = MODELS_BY_PROVIDER[provider as keyof typeof MODELS_BY_PROVIDER];
    if (models && !models.find(m => m.id === modelName)) {
      setModelName(models[0].id);
    }
  }, [provider]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({ apiKey, modelName, provider: provider as any });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-zoom-in max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <Settings size={20} />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-sm tracking-tight">Intelligence Hub</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Configure Providers & Models</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-lg text-slate-400 transition-all shadow-sm"><X size={20} /></button>
        </div>

        <div className="p-8 space-y-8 overflow-y-auto scrollbar-hide">
          {/* Provider Selection */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">
              <Box size={12} className="text-indigo-500" />
              Intelligence Provider
            </label>
            <div className="grid grid-cols-3 gap-3">
              {PROVIDERS.map((p) => {
                const isDisabled = p.id !== 'groq';
                return (
                  <button
                    key={p.id}
                    disabled={isDisabled}
                    onClick={() => setProvider(p.id as any)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all relative ${
                      provider === p.id 
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' 
                        : isDisabled
                          ? 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed opacity-60'
                          : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-200'
                    }`}
                  >
                    <div className={provider === p.id ? 'text-white' : isDisabled ? 'text-slate-300' : 'text-indigo-500'}>{p.icon}</div>
                    <span className="text-[10px] font-black uppercase tracking-widest">{p.name}</span>
                    {isDisabled && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[7px] font-black uppercase px-2 py-0.5 rounded-full whitespace-nowrap">Soon</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* API Key Section */}
          <div className="space-y-3 animate-fade-in" key={provider}>
            <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">
              <Key size={12} className="text-indigo-500" />
              {provider.toUpperCase()} API Key
            </label>
            <div className="relative group">
              <input 
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={`Paste your ${provider} API key...`}
                className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-200 focus:bg-white px-5 py-3.5 rounded-2xl text-xs font-bold text-slate-700 outline-none transition-all"
              />
              <button 
                onClick={() => setShowKey(!showKey)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-500 transition-colors"
              >
                {showKey ? <X size={14} /> : <RefreshCcw size={14} />}
              </button>
            </div>
            <p className="text-[9px] text-slate-400 font-bold px-1 italic leading-relaxed">
              Stays in your browser. {provider === 'groq' ? 'Get key at console.groq.com' : provider === 'gemini' ? 'Get key at aistudio.google.com' : 'Get key at platform.openai.com'}
            </p>
          </div>

          {/* Model Selection */}
          <div className="space-y-4 animate-fade-in" key={`${provider}-models`}>
            <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">
              <Cpu size={12} className="text-indigo-500" />
              {provider.toUpperCase()} Models
            </label>
            <div className="grid grid-cols-1 gap-2">
              {MODELS_BY_PROVIDER[provider as keyof typeof MODELS_BY_PROVIDER].map((model) => (
                <button
                  key={model.id}
                  onClick={() => setModelName(model.id)}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all text-left ${
                    modelName === model.id 
                      ? 'bg-indigo-50 border-indigo-200 ring-2 ring-indigo-50' 
                      : 'bg-white border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className="min-w-0">
                    <p className={`text-xs font-black ${modelName === model.id ? 'text-indigo-900' : 'text-slate-700'}`}>{model.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{model.speed}</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full" />
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Reasoning: {model.reasoning}</span>
                    </div>
                  </div>
                  {modelName === model.id && (
                    <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-100">
                      <ShieldCheck size={12} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center gap-3 shrink-0">
          <button 
            onClick={handleSave}
            className="flex-1 bg-slate-900 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200 active:scale-95"
          >
            <Save size={16} />
            Deploy Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
