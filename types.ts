export interface Color {
  hex: string;
  locked: boolean;
}

export interface SavedPalette {
  id: string;
  name: string;
  colors: string[]; // Store just hex codes for simplicity in storage
  timestamp: number;
}

export enum GenerationMode {
  AI = 'AI',
  RANDOM = 'RANDOM',
  MONOCHROMATIC = 'MONOCHROMATIC',
  ANALOGOUS = 'ANALOGOUS',
  COMPLEMENTARY = 'COMPLEMENTARY',
  TRIADIC = 'TRIADIC'
}

export interface GeneratorConfig {
  count: number;
  mode: GenerationMode;
  baseColor: string;
  prompt: string; // Only for AI mode
}
