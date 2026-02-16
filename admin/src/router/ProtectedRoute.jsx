import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return admin ? children : <Navigate to="/adminLogin" />;
};

export default ProtectedRoute;
