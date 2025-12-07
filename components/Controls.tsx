import React from 'react';
import { GenerationMode, GeneratorConfig } from '../types';
import { Palette, Shuffle, Download, Save, RefreshCw, Grid } from 'lucide-react';

interface ControlsProps {
  config: GeneratorConfig;
  setConfig: React.Dispatch<React.SetStateAction<GeneratorConfig>>;
  onGenerate: () => void;
  isGenerating: boolean;
  onSave: () => void;
  onExport: () => void;
  onExportPixelArt: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  config,
  setConfig,
  onGenerate,
  isGenerating,
  onSave,
  onExport,
  onExportPixelArt
}) => {

  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setConfig(prev => ({ ...prev, mode: e.target.value as GenerationMode }));
  };

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig(prev => ({ ...prev, count: parseInt(e.target.value, 10) }));
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig(prev => ({ ...prev, baseColor: e.target.value }));
  };

  return (
    <div className="w-full lg:w-80 bg-surface border-r border-slate-700 p-6 flex flex-col gap-6 h-auto lg:h-full overflow-y-auto shrink-0 z-10 shadow-xl">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
          <Palette className="text-white w-5 h-5" />
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          ChromaHarmonie
        </h1>
      </div>

      {/* Mode Selection */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mode de génération</label>
        <select 
          value={config.mode} 
          onChange={handleModeChange}
          className="w-full bg-slate-800 border border-slate-600 text-slate-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
        >
          <option value={GenerationMode.RANDOM}>🎲 Aléatoire</option>
          <option value={GenerationMode.MONOCHROMATIC}>🌊 Monochromatique</option>
          <option value={GenerationMode.ANALOGOUS}>🌈 Analogue</option>
          <option value={GenerationMode.TRIADIC}>🔺 Triadique</option>
          <option value={GenerationMode.COMPLEMENTARY}>🌗 Complémentaire</option>
        </select>
      </div>

      {/* Count Slider */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Nombre de couleurs</label>
          <span className="text-xs font-mono text-primary bg-blue-900/30 px-2 rounded">{config.count}</span>
        </div>
        <input 
          type="range" 
          min="1" 
          max="30" 
          value={config.count} 
          onChange={handleCountChange}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
        />
      </div>

      {/* Base Color Picker */}
      {config.mode !== GenerationMode.RANDOM && (
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Couleur Centrale
          </label>
          <div className="flex gap-2">
            <input 
              type="color" 
              value={config.baseColor}
              onChange={handleColorChange}
              className="h-10 w-10 p-0 border-0 rounded bg-transparent cursor-pointer"
            />
            <input 
              type="text" 
              value={config.baseColor}
              onChange={handleColorChange}
              className="flex-1 bg-slate-800 border border-slate-600 text-slate-200 rounded-md px-3 py-2 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <button 
        onClick={onGenerate}
        disabled={isGenerating}
        className="mt-2 w-full bg-primary hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? (
          <RefreshCw className="animate-spin w-5 h-5" />
        ) : (
          <Shuffle className="w-5 h-5" />
        )}
        {isGenerating ? 'Génération...' : 'Générer'}
      </button>

      <div className="flex-1" /> {/* Spacer */}

      <div className="space-y-3 pt-4 border-t border-slate-700">
        <button 
          onClick={onSave}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition-colors text-sm font-medium border border-slate-600"
        >
          <Save size={16} />
          Sauvegarder
        </button>
        
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={onExport}
            className="flex items-center justify-center gap-2 px-2 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition-colors text-xs font-medium border border-slate-600"
            title="Export standard (1200x600)"
          >
            <Download size={14} />
            Standard
          </button>
          <button 
            onClick={onExportPixelArt}
            className="flex items-center justify-center gap-2 px-2 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition-colors text-xs font-medium border border-slate-600"
            title="Export Pixel Art (8px/couleur)"
          >
            <Grid size={14} />
            Pixel Art
          </button>
        </div>
      </div>
    </div>
  );
};