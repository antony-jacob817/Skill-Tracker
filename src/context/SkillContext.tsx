import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Skill, ContentSuggestion, UserPreferences } from '../types';
import * as storage from '../utils/storage';

interface SkillContextType {
  skills: Skill[];
  preferences: UserPreferences;
  suggestions: ContentSuggestion[];
  loading: boolean;
  fetchSkills: () => void;
  addSkill: (skill: Omit<Skill, 'id' | 'createdAt' | 'updatedAt' | 'totalTime' | 'sessions' | 'tasks' | 'pinned'>) => Skill;
  updateSkill: (skill: Skill) => Skill;
  deleteSkill: (id: string) => void;
  addSession: (skillId: string, session: Omit<Session, 'id'>) => void;
  deleteSession: (skillId: string, sessionId: string) => void;
  addTask: (skillId: string, text: string) => void;
  updateTask: (skillId: string, taskId: string, completed: boolean) => void;
  deleteTask: (skillId: string, taskId: string) => void;
  togglePinSkill: (skillId: string) => void;
  updatePreferences: (preferences: UserPreferences) => void;
  fetchContentSuggestions: (skillName: string, skillLevel: string) => Promise<void>;
  exportData: () => string;
  importData: (jsonData: string) => void;
}

const SkillContext = createContext<SkillContextType | undefined>(undefined);

export const useSkillContext = () => {
  const context = useContext(SkillContext);
  if (!context) {
    throw new Error('useSkillContext must be used within a SkillProvider');
  }
  return context;
};

interface SkillProviderProps {
  children: ReactNode;
}

export const SkillProvider: React.FC<SkillProviderProps> = ({ children }) => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences>(storage.getPreferences());
  const [suggestions, setSuggestions] = useState<ContentSuggestion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Load data from localStorage on mount
  useEffect(() => {
    fetchSkills();
    setLoading(false);
  }, []);

  // Apply dark mode preference
  useEffect(() => {
    if (preferences.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [preferences.darkMode]);

  const fetchSkills = () => {
    const loadedSkills = storage.getSkills();
    setSkills(loadedSkills);
  };

  const addSkill = (skillData: Omit<Skill, 'id' | 'createdAt' | 'updatedAt' | 'totalTime' | 'sessions' | 'tasks' | 'pinned'>) => {
    const newSkill = storage.addSkill(skillData);
    setSkills(prevSkills => [...prevSkills, newSkill]);
    return newSkill;
  };

  const updateSkill = (updatedSkill: Skill) => {
    const result = storage.updateSkill(updatedSkill);
    setSkills(prevSkills => 
      prevSkills.map(skill => skill.id === updatedSkill.id ? updatedSkill : skill)
    );
    return result;
  };

  const deleteSkill = (id: string) => {
    storage.deleteSkill(id);
    setSkills(prevSkills => prevSkills.filter(skill => skill.id !== id));
  };

  const addSession = (skillId: string, session: Omit<Session, 'id'>) => {
    storage.addSession(skillId, session);
    fetchSkills(); // Refresh skills to get updated data
  };

  const deleteSession = (skillId: string, sessionId: string) => {
    storage.deleteSession(skillId, sessionId);
    fetchSkills(); // Refresh skills to get updated data
  };

  const addTask = (skillId: string, text: string) => {
    storage.addTask(skillId, text);
    fetchSkills(); // Refresh skills to get updated data
  };

  const updateTask = (skillId: string, taskId: string, completed: boolean) => {
    storage.updateTask(skillId, taskId, completed);
    fetchSkills(); // Refresh skills to get updated data
  };

  const deleteTask = (skillId: string, taskId: string) => {
    storage.deleteTask(skillId, taskId);
    fetchSkills(); // Refresh skills to get updated data
  };

  const togglePinSkill = (skillId: string) => {
    storage.togglePinSkill(skillId);
    fetchSkills(); // Refresh skills to get updated data
  };

  const updatePreferences = (newPreferences: UserPreferences) => {
    storage.savePreferences(newPreferences);
    setPreferences(newPreferences);
  };

  const fetchContentSuggestions = async (skillName: string, skillLevel: string) => {
    try {
      const newSuggestions = await storage.fetchContentSuggestions(skillName, skillLevel);
      storage.saveSuggestions(newSuggestions);
      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('Error fetching content suggestions:', error);
    }
  };

  const exportData = () => {
    return storage.exportData();
  };

  const importData = (jsonData: string) => {
    storage.importData(jsonData);
    fetchSkills();
    setPreferences(storage.getPreferences());
  };

  const value = {
    skills,
    preferences,
    suggestions,
    loading,
    fetchSkills,
    addSkill,
    updateSkill,
    deleteSkill,
    addSession,
    deleteSession,
    addTask,
    updateTask,
    deleteTask,
    togglePinSkill,
    updatePreferences,
    fetchContentSuggestions,
    exportData,
    importData,
  };

  return <SkillContext.Provider value={value}>{children}</SkillContext.Provider>;
};