import { BrowserRouter } from "react-router-dom";
import { RoutesApp } from "./routes";
import { AuthProvider } from "./components/context/AuthProvider";

import SocketIo from "socket.io-client";

export const io = SocketIo(import.meta.env.VITE_HOST_KEY).connect();
console.log(io)

export const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <RoutesApp />
      </BrowserRouter>
    </AuthProvider>
  );
};
