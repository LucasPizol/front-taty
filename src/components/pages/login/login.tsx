import imgLogin from "/img_login.jpg";
import styles from "./styles.module.css";
import { ChangeEvent, FormEvent, useState } from "react";
import { MdLock, MdPerson } from "react-icons/md";
import imgVulpe from "/logo_vulpe.svg";

import { useAuthContext } from "../../context/AuthContext";

const initialFields = {
  username: "",
  password: "",
};

export const Login = () => {
  const [fields, setFields] = useState<typeof initialFields>(initialFields);
  const [active, setIsActive] = useState<"username" | "password">();

  const { signIn } = useAuthContext();

  const handleChangeField = (e: ChangeEvent<HTMLInputElement>) => {
    setFields({ ...fields, [e.currentTarget.name]: e.currentTarget.value });
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await signIn(fields);
  };

  const handleChangeActive = (e: ChangeEvent<HTMLInputElement>) => {
    setIsActive(e.currentTarget.name as "username" | "password");
  };

  const handleChangeBlur = () => {
    setIsActive(undefined);
  };

  return (
    <main className={styles.main}>
      <form className={styles.form} onSubmit={handleLogin}>
        <div className={styles.greetings}>
          <h1>Seja bem vindo!</h1>
          <p>Gerencie seu WhatsApp!</p>
        </div>

        <div className={styles.formFields}>
          <div
            className={styles.inputView}
            style={active === "username" ? { border: "2px solid #00ab9b" } : {}}
          >
            <MdPerson
              size={25}
              color={active === "username" ? "#00ab9b" : "#777"}
              style={{ transition: "0.5s" }}
            />
            <input
              placeholder="Usuário"
              name="username"
              className={styles.input}
              onChange={handleChangeField}
              value={fields.username}
              type="text"
              onFocus={handleChangeActive}
              onBlur={handleChangeBlur}
            />
          </div>

          <div
            className={styles.inputView}
            style={active === "password" ? { border: "2px solid #00ab9b" } : {}}
          >
            <MdLock
              size={25}
              color={active === "password" ? "#00ab9b" : "#777"}
              style={{ transition: "0.5s" }}
            />
            <input
              placeholder="Senha"
              type="password"
              name="password"
              className={styles.input}
              onChange={handleChangeField}
              value={fields.password}
              onFocus={handleChangeActive}
              onBlur={handleChangeBlur}
            />
          </div>

          <button type="submit">Login</button>
        </div>

        <div className={styles.credits}>
          <p>Desenvolvido por</p>
          <div className={styles.employee}>
            <img src={imgVulpe} />
            <p>
              Vulpe<span>Tech</span>
            </p>
          </div>
        </div>
      </form>
      <img src={imgLogin} className={styles.img} alt="Imagem comunicação" />
    </main>
  );
};
