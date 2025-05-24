import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SkillProvider } from './context/SkillContext';
import DashboardPage from './pages/DashboardPage';
import SkillsPage from './pages/SkillsPage';
import SkillFormPage from './pages/SkillFormPage';
import SkillDetailPage from './pages/SkillDetailPage';
import SkillEditPage from './pages/SkillEditPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <SkillProvider>
      <Router>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/skills/new" element={<SkillFormPage />} />
          <Route path="/skills/:id" element={<SkillDetailPage />} />
          <Route path="/skills/:id/edit" element={<SkillEditPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Router>
      <footer className="mt-8 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>SkillPulse &copy; {new Date().getFullYear()} - Built with React</p>
          </footer>
    </SkillProvider>
  );
}

export default App;