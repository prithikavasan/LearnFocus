import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const InstructorRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" />;

  if (user.role !== "mentor") {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default InstructorRoute;
