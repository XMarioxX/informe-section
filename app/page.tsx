import React from 'react'
import ActivityDashboard from '@/app/pages/actividades';
import { ModeToggle } from '@/components/toogle-theme';

const HomePage = () => {
  return (
    <div>
      <ModeToggle />
      <ActivityDashboard />
    </div>
  );
};

export default HomePage;
