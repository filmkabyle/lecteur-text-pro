import React from 'react';
import { HistoryItem } from '../types';
import { Play, Download, Clock } from 'lucide-react';
import { audioBufferToWav } from '../utils/audioUtils';

interface HistoryListProps {
  history: HistoryItem[];
  onPlay: (item: HistoryItem) => void;
  currentlyPlayingId?: string;
  t: any; // Translation object
  lang: string;
}

const HistoryList: React.FC<HistoryListProps> = ({ history, onPlay, currentlyPlayingId, t, lang }) => {
  if (history.length === 0) return null;

  const handleDownload = (item: HistoryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.audioBuffer) return;
    
    const blob = audioBufferToWav(item.audioBuffer);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `natiq-${item.id}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getLocale = (l: string) => {
    switch(l) {
      case 'ar': return 'ar-SA';
      case 'fr': return 'fr-FR';
      default: return 'en-US';
    }
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-gray-600" />
        {t.historyTitle}
      </h3>
      <div className="space-y-3">
        {history.map((item) => (
          <div 
            key={item.id}
            onClick={() => onPlay(item)}
            className={`
              flex items-center justify-between p-4 rounded-lg border transition-colors cursor-pointer
              ${currentlyPlayingId === item.id ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-100 hover:bg-gray-50'}
            `}
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className={`p-3 rounded-full ${currentlyPlayingId === item.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                <Play className="w-5 h-5 fill-current" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-800 font-medium truncate text-start" dir="auto">
                  {item.text}
                </p>
                <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                  <span>{new Date(item.timestamp).toLocaleTimeString(getLocale(lang), { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span>{item.voiceName}</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span>{item.duration.toFixed(1)} {t.seconds}</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={(e) => handleDownload(item, e)}
              className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors ltr:ml-2 rtl:mr-2"
              title={t.download}
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryList;