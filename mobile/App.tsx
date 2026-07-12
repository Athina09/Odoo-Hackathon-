import { useState } from 'react';
import LoadingScreen from './screens/LoadingScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ActivitiesScreen from './screens/ActivitiesScreen';
import RewardScreen from './screens/RewardScreen';
import JoinChallengeScreen from './screens/JoinChallengeScreen';
import ProfileScreen from './screens/ProfileScreen';
import MyActivityScreen from './screens/MyActivityScreen';

export default function App() {
  const [currentPage, setCurrentPage] = useState<
    | 'loading'
    | 'login'
    | 'home'
    | 'activities'
    | 'reward'
    | 'joinChallenge'
    | 'profile'
    | 'myActivity'
  >('loading');

  if (currentPage === 'loading') {
    return <LoadingScreen onFinish={() => setCurrentPage('login')} />;
  }

  if (currentPage === 'login') {
    return <LoginScreen onLogin={() => setCurrentPage('home')} />;
  }

  if (currentPage === 'activities') {
    return <ActivitiesScreen onBack={() => setCurrentPage('home')} />;
  }

  if (currentPage === 'reward') {
    return <RewardScreen onBack={() => setCurrentPage('home')} />;
  }

  if (currentPage === 'joinChallenge') {
    return <JoinChallengeScreen onBack={() => setCurrentPage('home')} />;
  }

  if (currentPage === 'profile') {
    return (
      <ProfileScreen
        onBack={() => setCurrentPage('home')}
        onLogout={() => setCurrentPage('login')}
      />
    );
  }

  if (currentPage === 'myActivity') {
    return <MyActivityScreen onBack={() => setCurrentPage('home')} />;
  }

  return (
    <HomeScreen
      onOpenActivities={() => setCurrentPage('activities')}
      onOpenReward={() => setCurrentPage('reward')}
      onOpenJoinChallenge={() => setCurrentPage('joinChallenge')}
      onOpenProfile={() => setCurrentPage('profile')}
      onOpenMyActivity={() => setCurrentPage('myActivity')}
    />
  );
}