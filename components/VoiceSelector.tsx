import React from 'react';
import { Mic } from 'lucide-react';

interface VoiceSelectorProps {
  selectedVoice: string;
  onSelect: (voiceId: string) => void;
  disabled?: boolean;
  t: any; // Translation object
}

// Configuration is static, but descriptions/gender labels come from 't'
const VOICE_CONFIG = [
  { id: 'Puck', name: 'Puck', genderKey: 'male' },
  { id: 'Charon', name: 'Charon', genderKey: 'male' },
  { id: 'Kore', name: 'Kore', genderKey: 'female' },
  { id: 'Fenrir', name: 'Fenrir', genderKey: 'male' },
  { id: 'Zephyr', name: 'Zephyr', genderKey: 'female' },
];

const VoiceSelector: React.FC<VoiceSelectorProps> = ({ selectedVoice, onSelect, disabled, t }) => {
  return (
    <div className="space-y-3">
      <label className="text-gray-700 font-semibold flex items-center gap-2">
        <Mic className="w-5 h-5 text-indigo-600" />
        {t.selectVoice}
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {VOICE_CONFIG.map((voice) => (
          <button
            key={voice.id}
            onClick={() => onSelect(voice.id)}
            disabled={disabled}
            className={`
              relative p-4 rounded-xl border-2 transition-all duration-200 
              ${selectedVoice === voice.id 
                ? 'border-indigo-600 bg-indigo-50 shadow-md' 
                : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className="flex justify-between items-center mb-1">
               <span className={`text-xs px-2 py-0.5 rounded-full ${voice.genderKey === 'male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                {t[voice.genderKey]}
              </span>
              <span className="font-bold text-gray-800">{voice.name}</span>
            </div>
            <p className="text-sm text-gray-500 text-start">{t.voiceDesc[voice.id]}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default VoiceSelector;