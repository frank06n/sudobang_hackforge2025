import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import Emergencies from "./pages/Emergencies";
import ResourceManagement from "./pages/ResourceManagement";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/emergencies" element={<Emergencies />} />
      <Route path="/resources" element={<ResourceManagement />} />
    </Routes>
  );
};

export default AppRoutes;
