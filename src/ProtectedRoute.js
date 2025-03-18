import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { loading, isAuthenticated } = useSelector((state) => state.user);
  console.log("🚀 ~ ProtectedRoute ~ isAuthenticated:", isAuthenticated);
  console.log("🚀 ~ ProtectedRoute ~ loading:", loading)

  // If still loading, show a loading spinner or nothing
  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the children
  return children;
};

export default ProtectedRoute;