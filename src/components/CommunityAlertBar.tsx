'use client';

import React from 'react';
import { MessageCircle, Send, BellRing, ShieldCheck } from 'lucide-react';

export default function CommunityAlertBar() {
  return (
    <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-neutral-900 text-white rounded-xl p-4 sm:p-5 shadow-sm my-6 sm:my-8 border border-emerald-700/50 relative overflow-hidden">
      {/* Decorative Background Element */}
      <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        
        {/* Left: Message & Text */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-inner">
            <BellRing className="w-6 h-6 animate-bounce" />
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full inline-block">
                ऑफिशियल डिजिटल कम्युनिटी
              </span>
              <span className="text-emerald-400 text-xs hidden sm:inline-flex items-center gap-1 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                सत्यापित चैनल
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold font-hindi leading-snug">
              गाजीपुर, मरदह, फेफरा एवं उत्तर प्रदेश की हर ब्रेकिंग खबर सबसे पहले अपने फोन पर पाएं
            </h3>
            <p className="text-xs text-emerald-200/80 font-normal">
              सरकारी नौकरी, मंडी भाव, मौसम व स्थानीय विकास के तुरंत नोटिफिकेशन सीधे व्हाट्सएप पर।
            </p>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
          {/* WhatsApp Channel */}
          <a
            href="https://whatsapp.com/channel"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-sm transition hover:scale-[1.02] active:scale-[0.98]"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>व्हाट्सएप चैनल जॉइन करें</span>
          </a>

          {/* Telegram */}
          <a
            href="https://t.me"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-3.5 py-2.5 rounded-lg shadow-sm transition hover:scale-[1.02] active:scale-[0.98]"
          >
            <Send className="w-4 h-4 fill-current" />
            <span className="hidden sm:inline">टेलीग्राम</span>
          </a>
        </div>

      </div>
    </div>
  );
}
