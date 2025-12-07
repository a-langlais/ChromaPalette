import React, { useState, useEffect } from 'react';
import { Color, GenerationMode, GeneratorConfig, SavedPalette } from './types';
import { generateAlgorithmicPalette, generateRandomHex, downloadPaletteAsPng, downloadPixelArtPng } from './services/colorUtils';
import { Controls } from './components/Controls';
import { ColorSwatch } from './components/ColorSwatch';
import { SavedPalettes } from './components/SavedPalettes';
import { Library } from 'lucide-react';

export default function App() {
  // State
  const [colors, setColors] = useState<Color[]>([]);
  const [config, setConfig] = useState<GeneratorConfig>({
    count: 5,
    mode: GenerationMode.RANDOM,
    baseColor: '#3b82f6',
    prompt: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedPalettes, setSavedPalettes] = useState<SavedPalette[]>([]);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  // Initialize
  useEffect(() => {
    // Load saved palettes from local storage
    const saved = localStorage.getItem('chroma_saved_palettes');
    if (saved) {
      try {
        setSavedPalettes(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved palettes", e);
      }
    }
    // Generate initial palette
    handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save to local storage whenever list changes
  useEffect(() => {
    localStorage.setItem('chroma_saved_palettes', JSON.stringify(savedPalettes));
  }, [savedPalettes]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      let newHexCodes: string[] = [];

      // Determine which indices are locked
      // Locked colors strategy: Keep locked colors if possible.
      
      const seed = config.mode === GenerationMode.RANDOM ? generateRandomHex() : config.baseColor;
      newHexCodes = generateAlgorithmicPalette(seed, config.mode, config.count);
      
      // Merge with locked colors if array length allows
      const finalColors: Color[] = newHexCodes.map((hex, i) => {
        // Check if we have a locked color at this index from previous state
        const prevColor = colors[i];
        if (prevColor && prevColor.locked) {
            return prevColor;
        }
        return { hex, locked: false };
      });

      // Handle case where we increased count (append new colors)
      if (finalColors.length < config.count) {
          // Fill remaining
          for(let i = finalColors.length; i < config.count; i++) {
               finalColors.push({ hex: generateRandomHex(), locked: false });
          }
      }

      setColors(finalColors);

    } catch (error) {
      console.error("Generation failed", error);
      alert("Erreur lors de la génération.");
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleLock = (index: number) => {
    setColors(prev => prev.map((c, i) => i === index ? { ...c, locked: !c.locked } : c));
  };

  const savePalette = () => {
    const name = prompt("Nom de la palette:", `Palette ${savedPalettes.length + 1}`);
    if (!name) return;

    const newPalette: SavedPalette = {
      id: crypto.randomUUID(),
      name,
      colors: colors.map(c => c.hex),
      timestamp: Date.now()
    };

    setSavedPalettes(prev => [newPalette, ...prev]);
  };

  const deletePalette = (id: string) => {
    if(confirm("Supprimer cette palette ?")) {
        setSavedPalettes(prev => prev.filter(p => p.id !== id));
    }
  };

  const loadPalette = (palette: SavedPalette) => {
    setColors(palette.colors.map(hex => ({ hex, locked: true })));
    setConfig(prev => ({ ...prev, count: palette.colors.length }));
    setIsLibraryOpen(false);
  };

  const exportPng = () => {
    downloadPaletteAsPng(colors.map(c => c.hex), "ma-palette");
  };

  const exportPixelArt = () => {
    downloadPixelArtPng(colors.map(c => c.hex), "ma-palette");
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-slate-100 font-sans">
      
      {/* Sidebar Controls */}
      <Controls 
        config={config} 
        setConfig={setConfig} 
        onGenerate={handleGenerate} 
        isGenerating={isGenerating}
        onSave={savePalette}
        onExport={exportPng}
        onExportPixelArt={exportPixelArt}
      />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col relative transition-all duration-300">
        
        {/* Top Bar for Library Access on Mobile/Desktop */}
        <div className="absolute top-4 right-4 z-20">
           <button 
             onClick={() => setIsLibraryOpen(true)}
             className="bg-surface/80 backdrop-blur-md border border-slate-600 p-2 rounded-full hover:bg-slate-700 transition-colors shadow-lg"
             title="Mes Palettes"
           >
             <Library className="text-white w-6 h-6" />
           </button>
        </div>

        {/* Colors Display */}
        <div className="flex-1 flex flex-col md:flex-row w-full h-full">
           {colors.map((color, index) => (
             <ColorSwatch 
               key={`${index}-${color.hex}`} 
               color={color.hex} 
               isLocked={color.locked}
               onToggleLock={() => toggleLock(index)}
             />
           ))}
        </div>
      </div>

      {/* Library Drawer */}
      <SavedPalettes 
        palettes={savedPalettes}
        onLoad={loadPalette}
        onDelete={deletePalette}
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
      />

    </div>
  );
}