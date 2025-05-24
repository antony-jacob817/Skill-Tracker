import { Skill, Session, Task, UserPreferences, ContentSuggestion } from '../types';

// LocalStorage Keys
const SKILLS_KEY = 'skillboard_skills';
const PREFERENCES_KEY = 'skillboard_preferences';
const SUGGESTIONS_KEY = 'skillboard_suggestions';

// Default preferences
const defaultPreferences: UserPreferences = {
  darkMode: false,
  reminderEnabled: true,
  reminderTime: '19:00', // 7 PM
};

// Get all skills from localStorage
export const getSkills = (): Skill[] => {
  const skills = localStorage.getItem(SKILLS_KEY);
  return skills ? JSON.parse(skills) : [];
};

// Save all skills to localStorage
export const saveSkills = (skills: Skill[]): void => {
  localStorage.setItem(SKILLS_KEY, JSON.stringify(skills));
};

// Get a single skill by ID
export const getSkillById = (id: string): Skill | undefined => {
  const skills = getSkills();
  return skills.find(skill => skill.id === id);
};

// Add a new skill
export const addSkill = (skill: Omit<Skill, 'id' | 'createdAt' | 'updatedAt' | 'totalTime' | 'sessions' | 'tasks' | 'pinned'>): Skill => {
  const skills = getSkills();
  const newSkill: Skill = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    totalTime: 0,
    sessions: [],
    tasks: [],
    pinned: false,
    ...skill,
  };
  
  skills.push(newSkill);
  saveSkills(skills);
  return newSkill;
};

// Update an existing skill
export const updateSkill = (updatedSkill: Skill): Skill => {
  const skills = getSkills();
  const index = skills.findIndex(skill => skill.id === updatedSkill.id);
  
  if (index !== -1) {
    updatedSkill.updatedAt = new Date().toISOString();
    skills[index] = updatedSkill;
    saveSkills(skills);
  }
  
  return updatedSkill;
};

// Delete a skill
export const deleteSkill = (id: string): void => {
  const skills = getSkills();
  const updatedSkills = skills.filter(skill => skill.id !== id);
  saveSkills(updatedSkills);
};

// Add a session to a skill
export const addSession = (skillId: string, session: Omit<Session, 'id'>): Session => {
  const skills = getSkills();
  const skillIndex = skills.findIndex(skill => skill.id === skillId);
  
  if (skillIndex !== -1) {
    const newSession: Session = {
      id: crypto.randomUUID(),
      ...session,
    };
    
    // Add session to skill
    skills[skillIndex].sessions.push(newSession);
    
    // Update total time
    skills[skillIndex].totalTime += session.duration;
    
    // Update skill
    skills[skillIndex].updatedAt = new Date().toISOString();
    
    saveSkills(skills);
    return newSession;
  }
  
  throw new Error(`Skill with ID ${skillId} not found`);
};

// Delete a session
export const deleteSession = (skillId: string, sessionId: string): void => {
  const skills = getSkills();
  const skillIndex = skills.findIndex(skill => skill.id === skillId);
  
  if (skillIndex !== -1) {
    const sessionIndex = skills[skillIndex].sessions.findIndex(session => session.id === sessionId);
    
    if (sessionIndex !== -1) {
      // Subtract session duration from total time
      skills[skillIndex].totalTime -= skills[skillIndex].sessions[sessionIndex].duration;
      
      // Remove session
      skills[skillIndex].sessions.splice(sessionIndex, 1);
      
      // Update skill
      skills[skillIndex].updatedAt = new Date().toISOString();
      
      saveSkills(skills);
    }
  }
};

// Add a task to a skill
export const addTask = (skillId: string, text: string): Task => {
  const skills = getSkills();
  const skillIndex = skills.findIndex(skill => skill.id === skillId);
  
  if (skillIndex !== -1) {
    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      completed: false,
    };
    
    // Add task to skill
    skills[skillIndex].tasks.push(newTask);
    
    // Update skill
    skills[skillIndex].updatedAt = new Date().toISOString();
    
    saveSkills(skills);
    return newTask;
  }
  
  throw new Error(`Skill with ID ${skillId} not found`);
};

// Update a task
export const updateTask = (skillId: string, taskId: string, completed: boolean): void => {
  const skills = getSkills();
  const skillIndex = skills.findIndex(skill => skill.id === skillId);
  
  if (skillIndex !== -1) {
    const taskIndex = skills[skillIndex].tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex !== -1) {
      // Update task
      skills[skillIndex].tasks[taskIndex].completed = completed;
      
      // Update skill
      skills[skillIndex].updatedAt = new Date().toISOString();
      
      saveSkills(skills);
    }
  }
};

// Delete a task
export const deleteTask = (skillId: string, taskId: string): void => {
  const skills = getSkills();
  const skillIndex = skills.findIndex(skill => skill.id === skillId);
  
  if (skillIndex !== -1) {
    const taskIndex = skills[skillIndex].tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex !== -1) {
      // Remove task
      skills[skillIndex].tasks.splice(taskIndex, 1);
      
      // Update skill
      skills[skillIndex].updatedAt = new Date().toISOString();
      
      saveSkills(skills);
    }
  }
};

// Get user preferences
export const getPreferences = (): UserPreferences => {
  const preferences = localStorage.getItem(PREFERENCES_KEY);
  return preferences ? JSON.parse(preferences) : defaultPreferences;
};

// Save user preferences
export const savePreferences = (preferences: UserPreferences): void => {
  localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
};

// Toggle skill pinned status
export const togglePinSkill = (skillId: string): Skill | undefined => {
  const skills = getSkills();
  const skillIndex = skills.findIndex(skill => skill.id === skillId);
  
  if (skillIndex !== -1) {
    skills[skillIndex].pinned = !skills[skillIndex].pinned;
    skills[skillIndex].updatedAt = new Date().toISOString();
    saveSkills(skills);
    return skills[skillIndex];
  }
  
  return undefined;
};

// Export data as JSON
export const exportData = (): string => {
  const data = {
    skills: getSkills(),
    preferences: getPreferences(),
  };
  
  return JSON.stringify(data, null, 2);
};

// Import data from JSON
export const importData = (jsonData: string): void => {
  try {
    const data = JSON.parse(jsonData);
    
    if (data.skills) {
      saveSkills(data.skills);
    }
    
    if (data.preferences) {
      savePreferences(data.preferences);
    }
    
  } catch (error) {
    console.error('Error importing data:', error);
    throw new Error('Invalid JSON format');
  }
};

// Get content suggestions
export const getSuggestions = (): ContentSuggestion[] => {
  const suggestions = localStorage.getItem(SUGGESTIONS_KEY);
  return suggestions ? JSON.parse(suggestions) : [];
};

// Save content suggestions
export const saveSuggestions = (suggestions: ContentSuggestion[]): void => {
  localStorage.setItem(SUGGESTIONS_KEY, JSON.stringify(suggestions));
};

// Mock API call for content suggestions (in real app, this would be a server API call)
export const fetchContentSuggestions = async (skillName: string, skillLevel: string): Promise<ContentSuggestion[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Real course suggestions based on skill
  const suggestions: Record<string, ContentSuggestion[]> = {
    'JavaScript': [
      {
        id: crypto.randomUUID(),
        title: 'JavaScript Fundamentals',
        url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/',
        duration: 300,
        type: 'course',
        skillId: 'mock-skill-id',
      },
      {
        id: crypto.randomUUID(),
        title: 'Modern JavaScript Tutorial',
        url: 'https://javascript.info/',
        duration: 480,
        type: 'course',
        skillId: 'mock-skill-id',
      },
      {
        id: crypto.randomUUID(),
        title: 'JavaScript30 - 30 Day Challenge',
        url: 'https://javascript30.com/',
        duration: 900,
        type: 'course',
        skillId: 'mock-skill-id',
      },
    ],
    'Python': [
      {
        id: crypto.randomUUID(),
        title: 'Python for Everybody Specialization',
        url: 'https://www.coursera.org/specializations/python',
        duration: 480,
        type: 'course',
        skillId: 'mock-skill-id',
      },
      {
        id: crypto.randomUUID(),
        title: 'Automate the Boring Stuff with Python',
        url: 'https://automatetheboringstuff.com/',
        duration: 720,
        type: 'course',
        skillId: 'mock-skill-id',
      },
      {
        id: crypto.randomUUID(),
        title: 'Python Crash Course',
        url: 'https://ehmatthes.github.io/pcc/',
        duration: 600,
        type: 'course',
        skillId: 'mock-skill-id',
      },
    ],
    'React': [
      {
        id: crypto.randomUUID(),
        title: 'React Documentation',
        url: 'https://react.dev/learn',
        duration: 240,
        type: 'course',
        skillId: 'mock-skill-id',
      },
      {
        id: crypto.randomUUID(),
        title: 'Epic React by Kent C. Dodds',
        url: 'https://epicreact.dev/',
        duration: 1200,
        type: 'course',
        skillId: 'mock-skill-id',
      },
      {
        id: crypto.randomUUID(),
        title: 'React Projects Course',
        url: 'https://www.freecodecamp.org/learn/front-end-development-libraries/',
        duration: 300,
        type: 'course',
        skillId: 'mock-skill-id',
      },
    ],
  };
  
  return suggestions[skillName] || [
    {
      id: crypto.randomUUID(),
      title: `${skillName} Fundamentals Course`,
      url: `https://www.coursera.org/search?query=${encodeURIComponent(skillName)}`,
      duration: 480,
      type: 'course',
      skillId: 'mock-skill-id',
    },
    {
      id: crypto.randomUUID(),
      title: `Learn ${skillName} - Full Tutorial`,
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(`learn ${skillName} ${skillLevel} tutorial`)}`,
      duration: 120,
      type: 'video',
      skillId: 'mock-skill-id',
    },
  ];
};