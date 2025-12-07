import React from 'react';
import { Copy, Lock, Unlock } from 'lucide-react';

interface ColorSwatchProps {
  color: string;
  isLocked: boolean;
  onToggleLock: () => void;
  showInfo?: boolean;
}

export const ColorSwatch: React.FC<ColorSwatchProps> = ({ 
  color, 
  isLocked, 
  onToggleLock, 
  showInfo = true 
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(color);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Calculate contrast for text
  const getContrastColor = (hex: string) => {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return yiq >= 128 ? '#000000' : '#ffffff';
  };

  const textColor = getContrastColor(color);

  return (
    <div 
      className="relative flex-1 group min-h-[60px] transition-all duration-300 ease-in-out flex flex-col justify-end items-center pb-4"
      style={{ backgroundColor: color }}
    >
      {showInfo && (
        <div className={`opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center gap-2 mb-2`}>
           <button 
            onClick={onToggleLock}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors"
            style={{ color: textColor }}
            title={isLocked ? "Déverrouiller" : "Verrouiller"}
          >
            {isLocked ? <Lock size={16} /> : <Unlock size={16} />}
          </button>
          
          <button 
            onClick={handleCopy}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors text-sm font-mono font-bold"
             style={{ color: textColor }}
          >
            {copied ? 'Copié!' : color.toUpperCase()}
            {!copied && <Copy size={12} />}
          </button>
        </div>
      )}
      {/* Always show hex on small screens if not hovering? No, simpler to keep hover for desktop, tap for mobile usually */}
      {!showInfo && (
        <div className="w-full h-full min-h-[40px]" />
      )}
    </div>
  );
};
