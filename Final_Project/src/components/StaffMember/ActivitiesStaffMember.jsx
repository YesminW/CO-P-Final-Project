import React from 'react'
import NavigationDots from './NavigationDots';
import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';

export default function ActivitiesStaffMember() {
  const navigate = useNavigate();

  const handlers = useSwipeable({
    onSwipedLeft: () => navigate('/BonusStaffMember'), // נווט לדף כשמחלקים ימינה
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  return (
    <div className="screen-container" {...handlers}>
      <h1>Another Screen 2</h1>
      <p>This is another screen 2.</p>
      <NavigationDots activeIndex={2} />
    </div>
  );
}
