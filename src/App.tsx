import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import AuthGuard from "./components/AuthGuard";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";
import UserManagementPage from "./pages/UserManagementPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/admin"
                element={
                  <AuthGuard>
                    <AdminPage />
                  </AuthGuard>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AuthGuard>
                    <UserManagementPage />
                  </AuthGuard>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
