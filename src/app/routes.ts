import { createBrowserRouter } from 'react-router';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardApp } from './pages/DashboardApp';

export const router = createBrowserRouter([
  { path: '/', Component: LandingPage },
  { path: '/login', Component: LoginPage },
  { path: '/signup', Component: SignupPage },
  { path: '/dashboard', Component: DashboardApp },
]);
