export type CharacterId = 'arfita' | 'munif' | 'aisyah' | 'rayyan' | 'bilal' | 'salma';

export type DuaCategory = 'all' | 'daily' | 'meal' | 'home' | 'study' | 'activity' | 'travel';

export interface DuaItem {
  id: number;
  number: number;
  title: string;
  category: DuaCategory;
  categoryName: string;
  arabic: string;
  latin: string;
  translation: string;
  explanation: string;
  iconName: string;
  color: string;
  audioPrompt: string;
  funFact?: string;
  words?: {
    arabic: string;
    latin: string;
    meaning: string;
  }[];
}

export interface CharacterInfo {
  id: CharacterId;
  name: string;
  role: string;
  avatarColor: string;
  badge: string;
  voicePitch: number;
  voiceRate: number;
  imageSrc?: string;
  description: string;
}

export interface DuaWord {
  id: string;
  arabic: string;
  latin: string;
  meaningId: string;
  explanation: string;
  audioKey: string;
  startTime: number; // in seconds inside dua recitation scene
  duration: number;
}

export interface VideoScene {
  id: number;
  title: string;
  shortLabel: string;
  duration: number; // seconds
  narrationText: string;
  arabicText?: string;
  latinText?: string;
  translationText?: string;
  backgroundImage: string;
  characterAction: 'wave' | 'pray' | 'talk' | 'eat' | 'cheer';
  actionPrompt: string;
  funFact?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  imageIcon: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
    icon: string;
  }[];
}

export interface AdabItem {
  id: number;
  title: string;
  desc: string;
  iconName: string;
  sunnah: string;
  color: string;
}

