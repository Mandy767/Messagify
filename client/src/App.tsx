// App.tsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './store/AuthContext';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './store/PrivateRoutes';
import Layout from './layout/Layout';
import { NavbarProvider } from './store/NavbarContext';
import ChatPage from './pages/ChatPage';

function App() {
  return (
    <AuthProvider>
      <NavbarProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<ProtectedRoute><LoginPage /></ProtectedRoute>} />
              <Route path="/register" element={<ProtectedRoute><RegisterPage /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/chat/:userId1/:userId2" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
            </Routes>
          </Layout>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={true}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover={false}
          />
        </Router>
      </NavbarProvider>
    </AuthProvider>
  );
}

export default App;
