import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext"; // Adjust if path differs
import { AuthContextType } from "../types"; // Ensure this points to the correct type

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
