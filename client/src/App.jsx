import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Dashboard from './Pages/Dashboard';
import Home from './Pages/Home/HomePage';
import ProjectManagementPage from './Pages/AdminAccess/ProjectManagementPage';
import LogoutPage from './Pages/Logout/LogoutPage';
import LoginPage from './Pages/Login/LoginPage';

const App = () => {
  return (
    <>
      <Toaster/>

      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard/logout" element={<LogoutPage />} />

        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Home />} />

          <Route path="/dashboard/project-management" element={<ProjectManagementPage />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;