import { AuthContext } from "./AuthContext";
import { useEffect, useState } from "react";
import { io } from "../../App";
import Swal from "sweetalert2";
import axios from "axios";

type AuthProviderProps = {
  children: any;
};

type UserType = {
  user: {
    id: number;
    name: string;
    username: string;
    password: string;
    idDepartment: number;
  };
};

const getUser = async (): Promise<UserType> => {
  const token = sessionStorage.getItem("AUTH_SESSION_KEY");
  const data = await axios.get(
    import.meta.env.VITE_HOST_KEY + "/users/current",
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return data.data;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserType | null>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const signIn = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    if (!io) return;
    console.log(import.meta.env.VITE_HOST_KEY);
    const user = await axios.post(import.meta.env.VITE_HOST_KEY + "/login", {
      username,
      password,
    });

    if (user.data.error) {
      Swal.fire({
        title: "Erro",
        icon: "error",
        confirmButtonText: "Ok",
      });
      return;
    }

    setUser(user.data);
    sessionStorage.setItem("AUTH_SESSION_KEY", user.data.token);
  };

  const signOut = async () => {
    const confirm = await Swal.fire({
      title: "Atenção!",
      icon: "warning",
      text: "Deseja mesmo sair do app?",
      denyButtonText: "Não",
      showDenyButton: true,
      confirmButtonText: "Sim",
    });

    if (confirm.isConfirmed) {
      setUser(null);
      sessionStorage.removeItem("AUTH_SESSION_KEY");
    }
  };

  useEffect(() => {
    getUser()
      .then((data) => {
        setUser(data);
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <h1>Carregando...</h1>;

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut, io }}>
      {children}
    </AuthContext.Provider>
  );
};
