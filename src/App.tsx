/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Copy, Check, ExternalLink, AlertCircle, Zap } from 'lucide-react';

export default function App() {
  const [inputUrl, setInputUrl] = useState('');
  const [outputCommand, setOutputCommand] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const convertScript = () => {
    setError('');
    setOutputCommand('');
    
    if (!inputUrl.trim()) {
      setError('Please enter a script URL.');
      return;
    }

    let rawUrl = '';
    const url = inputUrl.trim();

    try {
      if (url.includes('pastebin.com')) {
        // Handle Pastebin: pastebin.com/XXXX -> pastebin.com/raw/XXXX
        const match = url.match(/pastebin\.com\/(?:raw\/)?([a-zA-Z0-9]+)/);
        if (match) {
          rawUrl = `https://pastebin.com/raw/${match[1]}`;
        }
      } else if (url.includes('github.com')) {
        // Handle GitHub: github.com/user/repo/blob/main/script.lua -> raw.githubusercontent.com/user/repo/main/script.lua
        rawUrl = url
          .replace('github.com', 'raw.githubusercontent.com')
          .replace('/blob/', '/');
      } else if (url.includes('pastefy.app')) {
        // Handle Pastefy: pastefy.app/XXXX -> pastefy.app/XXXX/raw
        const match = url.match(/pastefy\.app\/([a-zA-Z0-9]+)/);
        if (match) {
          rawUrl = `https://pastefy.app/${match[1]}/raw`;
        }
      } else if (url.includes('luarmor.net')) {
        // Luarmor links are often already direct or specific, we'll treat as direct if it looks like one
        rawUrl = url;
      }

      if (rawUrl) {
        setOutputCommand(`loadstring(game:HttpGet("${rawUrl}"))()`);
      } else {
        setError('Invalid Provider - Use GitHub/Pastebin.');
      }
    } catch (e) {
      setError('Invalid Provider - Use GitHub/Pastebin.');
    }
  };

  const copyToClipboard = () => {
    if (!outputCommand) return;
    navigator.clipboard.writeText(outputCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans selection:bg-[#8B5CF6] selection:text-white">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#8B5CF6] opacity-[0.05] blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#8B5CF6] opacity-[0.05] blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-3xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-10 bg-[#8B5CF6]/5 backdrop-blur-xl border border-[#8B5CF6]/20 p-10 rounded-3xl shadow-2xl"
        >
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-[#8B5CF6]">
              <Zap className="w-7 h-7 fill-current" />
            </div>
            <h1 
              className="text-7xl font-black tracking-tighter uppercase italic text-white"
              style={{
                textShadow: '-1px -1px 0 #8B5CF6, 1px -1px 0 #8B5CF6, -1px 1px 0 #8B5CF6, 1px 1px 0 #8B5CF6'
              }}
            >
              NIGHT HUB
            </h1>
            <p className="text-base text-zinc-400 max-w-xl">
              Convert raw script links into functional Roblox loadstring commands instantly.
            </p>
          </div>

          {/* Input Section */}
          <div className="space-y-5">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-[#8B5CF6] opacity-20 group-focus-within:opacity-40 transition duration-500 rounded-xl"></div>
              <div className="relative bg-black/40 border border-[#8B5CF6]/30 rounded-xl overflow-hidden backdrop-blur-md">
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="Paste GitHub, Pastebin, or Pastefy link..."
                  className="w-full bg-transparent px-6 py-5 text-base focus:outline-none placeholder:text-zinc-600"
                  onKeyDown={(e) => e.key === 'Enter' && convertScript()}
                />
                <button
                  onClick={convertScript}
                  className="absolute right-1 top-1 bottom-1 px-8 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold text-xs uppercase tracking-wider transition-colors rounded-lg"
                >
                  Convert
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 text-red-400 text-xs font-medium px-1"
                >
                  <AlertCircle className="w-3 h-3" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
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
                    <span className="text-[10px] uppercase tracking-widest font-bold">Output Command</span>
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-[#8B5CF6] hover:text-[#7C3AED] transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        Copy Command
                      </>
                    )}
                  </button>
                </div>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-[#8B5CF6] opacity-10 rounded-xl"></div>
                  <div className="relative bg-black/60 border border-[#8B5CF6]/30 rounded-xl p-4 font-mono text-xs break-all leading-relaxed text-zinc-300 backdrop-blur-md">
                    {outputCommand}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Supported Providers */}
          <div className="pt-8 border-t border-[#8B5CF6]/20">
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 mb-4">Supported Providers</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { name: 'GitHub', url: 'github.com' },
                { name: 'Pastebin', url: 'pastebin.com' },
                { name: 'Pastefy', url: 'pastefy.app' },
                { name: 'Luarmor', url: 'luarmor.net' },
              ].map((provider) => (
                <div key={provider.name} className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-zinc-300">{provider.name}</span>
                  <span className="text-[10px] text-zinc-500">{provider.url}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-8 left-0 right-0 text-center flex flex-col items-center gap-4">
        <div className="flex items-center gap-4">
          <a 
            href="https://discord.gg/JjqSEpj8P" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative flex items-center gap-2 px-4 py-2 bg-[#8B5CF6]/10 hover:bg-[#8B5CF6]/20 border border-[#8B5CF6]/20 backdrop-blur-md transition-all pointer-events-auto rounded-lg"
          >
            <div className="absolute -inset-0.5 bg-[#8B5CF6] opacity-0 group-hover:opacity-20 blur transition-opacity"></div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8B5CF6]">Join Discord</span>
            <ExternalLink className="w-3 h-3 text-[#8B5CF6]" />
          </a>
          <a 
            href="https://www.tiktok.com/@imback2249" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative flex items-center gap-2 px-4 py-2 bg-[#8B5CF6]/10 hover:bg-[#8B5CF6]/20 border border-[#8B5CF6]/20 backdrop-blur-md transition-all pointer-events-auto rounded-lg"
          >
            <div className="absolute -inset-0.5 bg-[#8B5CF6] opacity-0 group-hover:opacity-20 blur transition-opacity"></div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8B5CF6]">TikTok</span>
            <ExternalLink className="w-3 h-3 text-[#8B5CF6]" />
          </a>
        </div>
        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-800 pointer-events-none">
          Night Hub &copy; 2026
        </p>
      </footer>
    </div>
  );
}
