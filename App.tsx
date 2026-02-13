
import React, { useState } from 'react';
import { View } from './types';
import HomeView from './views/HomeView';
import FitnessView from './views/FitnessView';
import ProgressView from './views/ProgressView';
import ProfileView from './views/ProfileView';
import BottomNav from './components/BottomNav';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');

  const renderView = () => {
    switch (currentView) {
      case 'home': return <HomeView />;
      case 'fitness': return <FitnessView />;
      case 'progress': return <ProgressView />;
      case 'profile': return <ProfileView />;
      default: return <HomeView />;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl relative flex flex-col">
      <main className="flex-1 overflow-y-auto pb-20">
        {renderView()}
      </main>
      <BottomNav currentView={currentView} setCurrentView={setCurrentView} />
    </div>
  );
};

export default App;
