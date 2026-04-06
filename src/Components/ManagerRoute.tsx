import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

const AUTH_STORAGE_KEY = 'manager_auth';
const AUTH_VALID_VALUE = 'true';
const LOGIN_ROUTE = '/admin';

interface ManagerRouteProps {
  readonly children: ReactNode;
}

export function ManagerRoute({ children }: ManagerRouteProps) {
  const isAuthenticated = localStorage.getItem(AUTH_STORAGE_KEY) === AUTH_VALID_VALUE;

  if (!isAuthenticated) {
    return <Navigate to={LOGIN_ROUTE} replace />;
  }

  return <>{children}</>;
}
