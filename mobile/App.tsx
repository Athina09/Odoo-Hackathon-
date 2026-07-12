import { useState } from 'react';
import LoadingScreen from './screens/LoadingScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';

export default function App() {
  const [currentPage, setCurrentPage] = useState<
    'loading' | 'login' | 'home'
  >('loading');

  if (currentPage === 'loading') {
    return <LoadingScreen onFinish={() => setCurrentPage('login')} />;
  }

  if (currentPage === 'login') {
    return <LoginScreen onLogin={() => setCurrentPage('home')} />;
  }

  return <HomeScreen />;
}