/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Copy, Check, ExternalLink, AlertCircle, Zap, ShieldCheck, Activity } from 'lucide-react';
import { Toaster, toast } from 'sonner';

const PRESET_SCRIPTS = [
  { name: 'Fisch', url: 'https://raw.githubusercontent.com/example/fisch/main/script.lua' },
  { name: 'MM2', url: 'https://pastebin.com/raw/mm2script' },
  { name: 'Pet Sim 99', url: 'https://github.com/example/ps99/blob/main/main.lua' },
  { name: 'Blox Fruits', url: 'https://pastefy.app/bloxfruits/raw' },
];

export default function App() {
  const [inputUrl, setInputUrl] = useState('');
  const [outputCommand, setOutputCommand] = useState('');
  const [copied, setCopied] = useState(false);

  const convertScript = (urlToConvert = inputUrl) => {
    if (!urlToConvert.trim()) {
      toast.error('Please enter a script URL.');
      return;
    }

    let rawUrl = '';
    const url = urlToConvert.trim();

    try {
      if (url.includes('pastebin.com')) {
        const match = url.match(/pastebin\.com\/(?:raw\/)?([a-zA-Z0-9]+)/);
        if (match) rawUrl = `https://pastebin.com/raw/${match[1]}`;
      } else if (url.includes('github.com')) {
        rawUrl = url.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
      } else if (url.includes('pastefy.app')) {
        const match = url.match(/pastefy\.app\/([a-zA-Z0-9]+)/);
        if (match) rawUrl = `https://pastefy.app/${match[1]}/raw`;
      } else {
        rawUrl = url; // Treat as direct link if no match
      }

      if (rawUrl) {
        setOutputCommand(`loadstring(game:HttpGet("${rawUrl}"))()`);
        toast.success('Loadstring generated!');
      } else {
        toast.error('Invalid URL format.');
      }
    } catch (e) {
      toast.error('Conversion failed.');
    }
  };

  const copyToClipboard = () => {
    if (!outputCommand) return;
    navigator.clipboard.writeText(outputCommand);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePresetClick = (url: string) => {
    setInputUrl(url);
    convertScript(url);
  };

  return (
    <div className="min-h-screen bg-black text-[#e0e0e0] font-mono selection:bg-[#8B5CF6] selection:text-white overflow-x-hidden">
      <Toaster position="top-right" theme="dark" richColors />
      
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#8B5CF6] opacity-[0.08] blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#8B5CF6] opacity-[0.08] blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
      </div>

      <main className="relative z-10 max-w-3xl mx-auto px-6 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8 bg-black/60 backdrop-blur-2xl border border-[#8B5CF6]/30 p-8 md:p-12 rounded-3xl shadow-[0_0_50px_-12px_rgba(139,92,246,0.3)]"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-[#8B5CF6]">
                <Zap className="w-8 h-8 fill-current drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
                <div className="h-px w-12 bg-[#8B5CF6]/30" />
              </div>
              <h1 
                className="text-6xl md:text-7xl font-black tracking-tighter uppercase italic text-white"
                style={{
                  textShadow: '0 0 20px rgba(139,92,246,0.5), -1px -1px 0 #8B5CF6, 1px -1px 0 #8B5CF6, -1px 1px 0 #8B5CF6, 1px 1px 0 #8B5CF6'
                }}
              >
                NIGHT HUB
              </h1>
              <p className="text-xs uppercase tracking-[0.4em] text-[#8B5CF6] font-bold opacity-80">
                Advanced Script Encryption & Conversion
              </p>
            </div>
            
            <div className="flex items-center gap-3 bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 px-4 py-2 rounded-full backdrop-blur-md">
              <Activity className="w-4 h-4 text-[#8B5CF6] animate-pulse" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Solara:</span>
              <span className="text-[10px] uppercase tracking-widest font-bold text-green-400">Working ✅</span>
            </div>
          </div>

          {/* Script Menu */}
          <div className="space-y-4">
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 flex items-center gap-2">
              <ShieldCheck className="w-3 h-3" /> Quick Presets
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {PRESET_SCRIPTS.map((script) => (
                <button
                  key={script.name}
                  onClick={() => handlePresetClick(script.url)}
                  className="group relative bg-black/40 border border-[#8B5CF6]/20 hover:border-[#8B5CF6]/60 p-4 rounded-xl transition-all text-left overflow-hidden"
                >
                  <div className="absolute inset-0 bg-[#8B5CF6]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative text-xs font-bold text-zinc-400 group-hover:text-white transition-colors">
                    {script.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Input Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500">Input Script URL</h3>
            </div>
            <div className="relative group">
              <div className="absolute -inset-1 bg-[#8B5CF6] opacity-10 group-focus-within:opacity-20 blur-lg transition duration-500 rounded-2xl"></div>
              <div className="relative bg-black/40 border border-[#8B5CF6]/30 rounded-2xl overflow-hidden backdrop-blur-md">
                <textarea
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="Paste GitHub, Pastebin, or Pastefy link..."
                  className="w-full bg-transparent px-6 py-8 text-sm focus:outline-none placeholder:text-zinc-700 min-h-[120px] resize-none"
                />
              </div>
            </div>
            
            <button
              onClick={() => convertScript()}
              className="w-full group relative py-5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-black text-sm uppercase tracking-[0.3em] transition-all rounded-2xl shadow-[0_0_30px_-5px_rgba(139,92,246,0.5)] active:scale-[0.98]"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              Generate Loadstring
            </button>
          </div>

          {/* Output Section */}
          <AnimatePresence>
            {outputCommand && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2 text-zinc-500">
                    <Terminal className="w-3 h-3" />
                    <span className="text-[10px] uppercase tracking-widest font-bold">Generated Output</span>
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-[#8B5CF6] hover:text-[#7C3AED] transition-colors"
                  >
                    {copied ? (
                      <><Check className="w-3 h-3" /> Copied</>
                    ) : (
                      <><Copy className="w-3 h-3" /> Copy Command</>
                    )}
                  </button>
                </div>
                <div className="relative group">
                  <div className="absolute -inset-1 bg-[#8B5CF6] opacity-5 rounded-2xl"></div>
                  <div className="relative bg-black/80 border border-[#8B5CF6]/30 rounded-2xl p-6 font-mono text-xs break-all leading-relaxed text-zinc-400 backdrop-blur-md">
                    {outputCommand}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer Info */}
          <div className="pt-8 border-t border-[#8B5CF6]/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6">
              <a 
                href="https://discord.gg/JjqSEpj8P" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-zinc-500 hover:text-[#8B5CF6] transition-colors"
              >
                Discord <ExternalLink className="w-3 h-3" />
              </a>
              <a 
                href="https://www.tiktok.com/@imback2249" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-zinc-500 hover:text-[#8B5CF6] transition-colors"
              >
                TikTok <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-800">
              Night Hub &copy; 2026 // v2.0.4
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
