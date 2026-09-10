import {
  Navigate,
  Outlet,
} from "react-router-dom";


function ProtectedRoute() {
  const autenticado =
    sessionStorage.getItem(
      "isAuthenticated"
    ) === "true";


  if (!autenticado) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  return <Outlet />;
}


export default ProtectedRoute;