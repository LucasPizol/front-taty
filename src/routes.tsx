import { Routes, Route } from "react-router-dom";
import { Login } from "./components/pages/login/login";
import { useAuthContext } from "./components/context/AuthContext";
import { Content } from "./components/pages/content/content";

export const RoutesApp = () => {
  const { user } = useAuthContext();

  return (
    <Routes>
      {user ? (
        <Route path="/" element={<Content />} />
      ) : (
        <Route path="/" element={<Login />} />
      )}
    </Routes>
  );
};
