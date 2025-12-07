import React from 'react';
import { SavedPalette } from '../types';
import { Trash2, ExternalLink } from 'lucide-react';

interface SavedPalettesProps {
  palettes: SavedPalette[];
  onLoad: (palette: SavedPalette) => void;
  onDelete: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const SavedPalettes: React.FC<SavedPalettesProps> = ({ 
  palettes, 
  onLoad, 
  onDelete,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-surface border-l border-slate-700 shadow-2xl transform transition-transform duration-300 z-50 flex flex-col">
      <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
        <h2 className="text-lg font-semibold text-white">Bibliothèque</h2>
        <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {palettes.length === 0 ? (
          <div className="text-center text-slate-500 mt-10">
            <p>Aucune palette sauvegardée.</p>
          </div>
        ) : (
          palettes.map((palette) => (
            <div key={palette.id} className="bg-slate-800 rounded-lg p-3 border border-slate-700 hover:border-slate-500 transition-all group">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-slate-200 text-sm truncate pr-2" title={palette.name}>
                  {palette.name}
                </h3>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => onLoad(palette)}
                    className="p-1 hover:bg-slate-700 rounded text-blue-400"
                    title="Charger"
                  >
                    <ExternalLink size={14} />
                  </button>
                  <button 
                    onClick={() => onDelete(palette.id)}
                    className="p-1 hover:bg-slate-700 rounded text-red-400"
                    title="Supprimer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              
              <div className="flex h-8 rounded-md overflow-hidden w-full cursor-pointer" onClick={() => onLoad(palette)}>
                {palette.colors.slice(0, 10).map((c, i) => (
                  <div key={i} style={{ backgroundColor: c }} className="flex-1 h-full" />
                ))}
              </div>
              <div className="mt-2 text-xs text-slate-500">
                {palette.colors.length} couleurs • {new Date(palette.timestamp).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
