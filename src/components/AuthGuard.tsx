import { ReactNode, FC } from "react";
import { useAuth } from "../hooks/useAuth";
import LoginForm from "./LoginForm";

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard: FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return <>{children}</>;
};

export default AuthGuard;
