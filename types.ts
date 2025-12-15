export interface VoiceOption {
  id: string;
  name: string;
  gender: 'Male' | 'Female';
  description: string;
}

export interface HistoryItem {
  id: string;
  text: string;
  voiceName: string;
  timestamp: number;
  audioBuffer: AudioBuffer | null;
  duration: number;
}

export enum TTSStatus {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  PLAYING = 'PLAYING',
  ERROR = 'ERROR'
}

export interface GenerateTTSParams {
  text: string;
  voiceName: string;
}
