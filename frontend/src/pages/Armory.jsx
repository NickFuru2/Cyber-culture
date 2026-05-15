import React from 'react';
import { ShoppingCart, Crosshair, TrendingUp, Package, Clock } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Armory() {
  const agentInfo = useStore(state => state.agentInfo);

  return (
    <div className="p-8 h-full flex flex-col gap-6">
      <header className="flex justify-between items-end border-b border-cyan-500/20 pb-4">
        <div>
          <h1 className="text-2xl text-cyan-400 font-h1 flex items-center gap-2">
            <ShoppingCart /> BLACK MARKET & AUCTIONS
          </h1>
          <p className="text-gray-400 font-body">Dynamic pricing algorithms active. Acquire assets.</p>
        </div>
        <div className="text-right">
           <div className="font-code text-xs text-gray-500">CREDITS BALANCE</div>
           <div className="font-code text-xl text-secondary-container">₿ 1,337.00</div>
        </div>
      </header>

      {/* Starter Pack Row */}
      <div className="glass-panel border border-secondary-container/50 bg-secondary-container/5 p-6 flex flex-col md:flex-row justify-between items-center gap-4 glow-hover relative overflow-hidden">
         <div className="absolute top-0 left-0 w-1 h-full bg-secondary-container shadow-[0_0_10px_rgba(195,244,0,0.8)]"></div>
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border border-secondary-container flex items-center justify-center text-secondary-container bg-secondary-container/20">
               <Package size={24}/>
            </div>
            <div>
               <h3 className="font-h3 text-xl text-white">RECRUIT STARTER PACK</h3>
               <p className="text-sm text-gray-400">Essential tools for new operatives: Basic VPN, Dictionary List, and 500 XP Boost.</p>
            </div>
         </div>
         <button className="bg-secondary-container text-black font-code font-bold px-8 py-3 hover:bg-[#a5cc00] transition-all shadow-[0_0_15px_rgba(195,244,0,0.3)]">
            CLAIM (FREE)
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-2">
        
        {/* Dynamic Market Pricing */}
        <div className="glass-panel border border-cyan-500/20 flex flex-col glow-hover overflow-hidden">
           <header className="bg-cyan-900/20 border-b border-cyan-500/20 p-4 font-code text-sm text-cyan-400 flex items-center gap-2 justify-between">
             <div className="flex items-center gap-2"><TrendingUp size={16}/> DYNAMIC MARKET PRICING</div>
             <span className="text-[10px] text-gray-400">UPDATES EVERY 60s</span>
           </header>
           <div className="p-4 flex flex-col gap-3">
              <div className="flex justify-between items-center p-3 border border-surface-variant hover:border-cyan-500/50 transition-all bg-[#10141a]">
                 <div>
                    <h4 className="font-code text-white">DDoS Botnet Token</h4>
                    <span className="text-[10px] text-error flex items-center gap-1">↑ +14.2% HIGH DEMAND</span>
                 </div>
                 <div className="text-right">
                    <div className="font-code text-cyan-400">₿ 500.00</div>
                    <button className="mt-1 px-3 py-1 bg-surface-variant text-white text-[10px] font-code hover:bg-cyan-400 hover:text-black transition-all">BUY</button>
                 </div>
              </div>

              <div className="flex justify-between items-center p-3 border border-surface-variant hover:border-cyan-500/50 transition-all bg-[#10141a]">
                 <div>
                    <h4 className="font-code text-white">Zero-Day Exploit</h4>
                    <span className="text-[10px] text-secondary-container flex items-center gap-1">↓ -5.1% OVERSUPPLY</span>
                 </div>
                 <div className="text-right">
                    <div className="font-code text-cyan-400">₿ 1,200.00</div>
                    <button className="mt-1 px-3 py-1 bg-surface-variant text-white text-[10px] font-code hover:bg-cyan-400 hover:text-black transition-all">BUY</button>
                 </div>
              </div>

              <div className="flex justify-between items-center p-3 border border-surface-variant hover:border-cyan-500/50 transition-all bg-[#10141a]">
                 <div>
                    <h4 className="font-code text-white">Firewall Patch v4</h4>
                    <span className="text-[10px] text-gray-400 flex items-center gap-1">- STABLE</span>
                 </div>
                 <div className="text-right">
                    <div className="font-code text-cyan-400">₿ 150.00</div>
                    <button className="mt-1 px-3 py-1 bg-surface-variant text-white text-[10px] font-code hover:bg-cyan-400 hover:text-black transition-all">BUY</button>
                 </div>
              </div>
           </div>
        </div>

        {/* Live Auction */}
        <div className="glass-panel border border-error/20 flex flex-col glow-hover overflow-hidden relative">
           <div className="absolute top-0 right-0 w-1 h-full bg-error shadow-[0_0_10px_rgba(255,180,171,0.8)]"></div>
           <header className="bg-error/10 border-b border-error/20 p-4 font-code text-sm text-error flex items-center gap-2 justify-between">
             <div className="flex items-center gap-2"><Clock size={16}/> EXCLUSIVE AUCTION</div>
             <div className="animate-pulse">ENDS IN: 04:12</div>
           </header>
           <div className="p-6 flex flex-col gap-4 flex-1 justify-center">
              <div className="text-center">
                 <h2 className="font-h1 text-3xl text-white">QUANTUM DECRYPTOR</h2>
                 <p className="text-sm text-gray-400 mt-2 max-w-sm mx-auto">One-time use hardware capable of instantly bypassing any encryption standard on the grid. Only 1 exists.</p>
              </div>
              <div className="bg-[#10141a] border border-error/30 p-4 text-center mt-4">
                 <div className="text-[10px] font-code text-gray-500">CURRENT HIGHEST BID</div>
                 <div className="font-code text-4xl text-error mt-1">₿ 14,500.00</div>
                 <div className="text-xs font-code text-cyan-400 mt-2">BIDDER: ANON_84x</div>
              </div>
              <div className="flex gap-2 mt-2">
                 <input type="number" placeholder="Enter Bid..." className="flex-1 bg-black border border-surface-variant p-3 text-white font-code outline-none focus:border-error" />
                 <button className="bg-error text-black font-code font-bold px-6 hover:bg-error/80 transition-all">PLACE BID</button>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
