import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useSkillContext } from '../context/SkillContext';
import { 
  Moon, Sun, Bell, BellOff, Download, Upload, AlertCircle,
  Check, X, Clock
} from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { preferences, updatePreferences, exportData, importData } = useSkillContext();
  const [importText, setImportText] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importError, setImportError] = useState('');
  const [exportSuccess, setExportSuccess] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  
  const handleDarkModeToggle = () => {
    updatePreferences({
      ...preferences,
      darkMode: !preferences.darkMode,
    });
  };
  
  const handleReminderToggle = () => {
    updatePreferences({
      ...preferences,
      reminderEnabled: !preferences.reminderEnabled,
    });
  };
  
  const handleReminderTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePreferences({
      ...preferences,
      reminderTime: e.target.value,
    });
  };
  
  const handleExport = () => {
    const dataStr = exportData();
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `skillboard_export_${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };
  
  const handleImport = () => {
    setShowImportModal(true);
  };
  
  const processImport = () => {
    try {
      importData(importText);
      setImportSuccess(true);
      setImportError('');
      setTimeout(() => {
        setShowImportModal(false);
        setImportText('');
        setImportSuccess(false);
      }, 2000);
    } catch (error) {
      setImportError('Invalid JSON format. Please check your data and try again.');
    }
  };
  
  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        
        {/* Appearance Section */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Appearance</h2>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">Dark Mode</h3>
              <p className="text-gray-600 dark:text-gray-400">Toggle between light and dark theme</p>
            </div>
            <button
              onClick={handleDarkModeToggle}
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                preferences.darkMode ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span className="sr-only">Toggle dark mode</span>
              <span
                className={`${
                  preferences.darkMode ? 'translate-x-6 bg-white' : 'translate-x-1 bg-white'
                } inline-block w-4 h-4 transform rounded-full transition-transform`}
              />
              <span className={`absolute ${preferences.darkMode ? 'right-1.5' : 'left-1.5'} text-xs`}>
                {preferences.darkMode ? <Moon size={10} className="text-primary-800" /> : <Sun size={10} className="text-yellow-500" />}
              </span>
            </button>
          </div>
        </div>
        
        {/* Notifications Section */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Notifications</h2>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">Daily Reminder</h3>
              <p className="text-gray-600 dark:text-gray-400">Show a reminder if no learning sessions are logged</p>
            </div>
            <button
              onClick={handleReminderToggle}
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                preferences.reminderEnabled ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span className="sr-only">Toggle reminder</span>
              <span
                className={`${
                  preferences.reminderEnabled ? 'translate-x-6 bg-white' : 'translate-x-1 bg-white'
                } inline-block w-4 h-4 transform rounded-full transition-transform`}
              />
              <span className={`absolute ${preferences.reminderEnabled ? 'right-1.5' : 'left-1.5'} text-xs`}>
                {preferences.reminderEnabled ? <Bell size={10} className="text-primary-800" /> : <BellOff size={10} className="text-gray-500" />}
              </span>
            </button>
          </div>
          
          {preferences.reminderEnabled && (
            <div className="mt-4">
              <label htmlFor="reminderTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Reminder Time
              </label>
              <div className="flex items-center">
                <Clock size={18} className="text-gray-400 mr-2" />
                <input
                  type="time"
                  id="reminderTime"
                  value={preferences.reminderTime}
                  onChange={handleReminderTimeChange}
                  className="input w-32"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                A reminder will appear if you haven't logged any sessions by this time
              </p>
            </div>
          )}
        </div>
        
        {/* Data Management Section */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Data Management</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-1">Export Data</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Download all your skills and learning data as a JSON file
              </p>
              <button 
                onClick={handleExport}
                className="btn btn-primary flex items-center space-x-2"
              >
                <Download size={18} />
                <span>Export Data</span>
              </button>
              
              {exportSuccess && (
                <div className="mt-2 text-sm text-success-600 dark:text-success-400 flex items-center">
                  <Check size={16} className="mr-1" />
                  <span>Data exported successfully</span>
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-1">Import Data</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Upload a previously exported JSON file to restore your data
              </p>
              <button 
                onClick={handleImport}
                className="btn btn-outline flex items-center space-x-2"
              >
                <Upload size={18} />
                <span>Import Data</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* About Section */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">About</h2>
          
          <div className="space-y-2">
            <p className="text-gray-700 dark:text-gray-300">SkillBoard v0.1.0</p>
            <p className="text-gray-600 dark:text-gray-400">
              A learning tracker to help you monitor and improve your skills
            </p>
          </div>
        </div>
      </div>
      
      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-xl animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Import Data</h2>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportText('');
                  setImportError('');
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>
            
            {importSuccess ? (
              <div className="py-8 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400 mb-4">
                  <Check size={24} />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Import Successful</h3>
                <p className="text-gray-600 dark:text-gray-400">Your data has been imported successfully</p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Paste your previously exported JSON data below
                  </p>
                  <textarea
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    className="textarea h-48"
                    placeholder='{"skills": [...], "preferences": {...}}'
                  ></textarea>
                  
                  {importError && (
                    <div className="mt-2 text-sm text-error-600 dark:text-error-400 flex items-center">
                      <AlertCircle size={16} className="mr-1" />
                      <span>{importError}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowImportModal(false);
                      setImportText('');
                      setImportError('');
                    }}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={processImport}
                    disabled={!importText.trim()}
                    className="btn btn-primary"
                  >
                    Import
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default SettingsPage;