import React, { useEffect, useRef, type ReactNode } from 'react';
import { Activity, Cloud, Lock, DatabaseBackup, ServerCog, TerminalSquare } from 'lucide-react';

interface BentoItemProps {
  className?: string;
  children: ReactNode;
}

const BentoItem = ({ className = '', children }: BentoItemProps) => {
  const itemRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const item = itemRef.current;
    if (!item) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      item.style.setProperty('--mouse-x', `${x}px`);
      item.style.setProperty('--mouse-y', `${y}px`);
    };

    item.addEventListener('mousemove', handleMouseMove);
    return () => item.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={itemRef} className={`bento-item ${className}`}>
      {children}
    </div>
  );
};

export function CyberneticBentoGrid() {
  return (
    <div className="main-container">
      <div className="w-full max-w-6xl z-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-white text-center mb-8">Core Features</h1>
        <div className="bento-grid">
          <BentoItem className="col-span-2 row-span-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Activity size={18} className="text-red-400" />
                <h2 className="text-2xl font-bold text-white">Real-time Analytics</h2>
              </div>
              <p className="mt-2 text-gray-400">
                Monitor your application's performance with up-to-the-second data streams and visualizations.
              </p>
            </div>
            <div className="mt-4 h-48 rounded-lg overflow-hidden border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80"
                alt="Analytics dashboard"
                className="w-full h-full object-cover"
              />
            </div>
          </BentoItem>

          <BentoItem>
            <div className="flex items-center gap-2 mb-2">
              <Cloud size={16} className="text-cyan-400" />
              <h2 className="text-xl font-bold text-white">Global CDN</h2>
            </div>
            <p className="mt-2 text-gray-400 text-sm">
              Deliver content at lightning speed, no matter where your users are.
            </p>
          </BentoItem>

          <BentoItem>
            <div className="flex items-center gap-2 mb-2">
              <Lock size={16} className="text-green-400" />
              <h2 className="text-xl font-bold text-white">Secure Auth</h2>
            </div>
            <p className="mt-2 text-gray-400 text-sm">
              Enterprise-grade authentication and user management built-in.
            </p>
          </BentoItem>

          <BentoItem className="row-span-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <DatabaseBackup size={16} className="text-purple-400" />
                <h2 className="text-xl font-bold text-white">Automated Backups</h2>
              </div>
              <p className="mt-2 text-gray-400 text-sm">
                Your data is always safe with automated, redundant backups.
              </p>
            </div>
            <img
              src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
              alt="Cloud backup"
              className="mt-4 h-32 w-full object-cover rounded-lg border border-white/10"
            />
          </BentoItem>

          <BentoItem className="col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <ServerCog size={16} className="text-amber-400" />
              <h2 className="text-xl font-bold text-white">Serverless Functions</h2>
            </div>
            <p className="mt-2 text-gray-400 text-sm">
              Run your backend code without managing servers. Scale infinitely with ease.
            </p>
          </BentoItem>

          <BentoItem>
            <div className="flex items-center gap-2 mb-2">
              <TerminalSquare size={16} className="text-blue-400" />
              <h2 className="text-xl font-bold text-white">CLI Tool</h2>
            </div>
            <p className="mt-2 text-gray-400 text-sm">
              Manage your entire infrastructure from the command line.
            </p>
            <img
              src="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=600&q=80"
              alt="Developer terminal"
              className="mt-4 h-20 w-full object-cover rounded-lg border border-white/10"
            />
          </BentoItem>
        </div>
      </div>
    </div>
  );
}
