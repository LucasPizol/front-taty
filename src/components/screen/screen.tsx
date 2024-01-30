import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { Message, MessageType } from "../message/message";
import styles from "./styles.module.css";
import { MdSend, MdPerson } from "react-icons/md";
import { useAuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";
import { CustomerType } from "../customer/customer";
import axios from "axios";

type Props = {
  messages: MessageType[];
  setMessages: any;
  activeCustomer?: CustomerType;
  setCustomers: any;
  customers: CustomerType[] | undefined;
  messagesRef: any;
  setActiveCustomer: any;
  customersRef: any;
};

export const Screen = ({
  messages,
  setMessages,
  activeCustomer,
  setCustomers,
  customers,
  messagesRef,
  setActiveCustomer,
  customersRef,
}: Props) => {
  const [message, setMessage] = useState<string>("");


  const [name, setName] = useState<string>("");

  const { io, user } = useAuthContext();

  const refMain = useRef(null);

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (user.id !== activeCustomer?.userActive) {
      return;
    }
    const token = sessionStorage.getItem("AUTH_SESSION_KEY");

    if (!message || !token || !activeCustomer) return;

    const { data, status } = await axios.post(
      import.meta.env.VITE_HOST_KEY + "/message",
      {
        content: message,
        idCustomer: activeCustomer.id,
      },
      { headers: { Authorization: "Bearer " + token } }
    );

    if (status === 400) {
      Swal.fire({
        title: "Ocorreu um erro ao enviar",
        icon: "error",
      });
    }

    setMessages([
      ...messages,
      {
        ...data.message,
        content: message,
      },
    ]);

    if (!customers) return;

    const newCustomers = [...customers];

    const index = newCustomers?.findIndex(
      (customer) => customer.id === activeCustomer.id
    );

    newCustomers[index] = {
      ...activeCustomer,
      lastMessage: {
        ...data.message,
        content: message,
      },
    };

    messagesRef.current = [
      ...messages,
      {
        ...data.message,
        content: message,
      },
    ];
    setCustomers(newCustomers);
    setMessage("");
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (user.id !== activeCustomer?.userActive) {
      return;
    }
    setMessage(e.currentTarget.value);
  };

  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
  };

  const handleUpdateName = async () => {
    const token = sessionStorage.getItem("AUTH_SESSION_KEY");
    const copyCustomers = [...customers!];

    const findCustomer = copyCustomers.findIndex(
      (customer) => customer.id === activeCustomer?.id
    );

    copyCustomers[findCustomer].name = name;

    customersRef.current = copyCustomers;

    setCustomers(copyCustomers);
    await axios.put(
      import.meta.env.VITE_HOST_KEY + `/customer/name/${activeCustomer?.id}`,
      {
        name,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
  };

  const handleLeftSession = async () => {
    const confirm = await Swal.fire({
      icon: "warning",
      text: "Deseja encerrar esta sessão?",
      title: "Encerrar sessão",
      confirmButtonText: "Sim",
      showDenyButton: true,
      denyButtonText: "Não",
    });

    if (confirm.isConfirmed) {
      io.emit("leave_session", { _id: activeCustomer?.id });
      const token = sessionStorage.getItem("AUTH_SESSION_KEY");

      await axios.put(
        import.meta.env.VITE_HOST_KEY + `/customer/session/${activeCustomer?.id}`,
        {},
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      const message =
        "Olá, este chat foi encerrado, assim que necessitar, envie novamente uma mensagem que iremos responder. A equipe Vulpe agradece seu contato.";

      const { data } = await axios.post(
        import.meta.env.VITE_HOST_KEY + "/message",
        {
          content: message,
          idCustomer: activeCustomer?.id,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      setMessages([
        ...messages,
        {
          ...data.message,
          content: message,
        },
      ]);

      setActiveCustomer({ ...activeCustomer, userActive: null });
    }
  };

  const returnIfUserActive = () => {
    return <p className={styles.blocked}>Sessao inativa</p>;
  };

  useEffect(() => {
    //@ts-ignore
    refMain?.current.scrollTo(0, 9999999);
  }, [activeCustomer, messages]);

  useEffect(() => {
    if (activeCustomer) {
      setName(activeCustomer.name || activeCustomer.number.split("@c.us")[0]);
    }
  }, [activeCustomer]);

  return (
    <main className={styles.screen}>
      <header className={styles.header}>
        {activeCustomer ? (
          <>
            <div className={styles.headerInfo}>
              <MdPerson
                size={40}
                color="#00ab9b"
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "50%",
                  padding: "4px",
                }}
              />
              <input
                value={name}
                onBlur={handleUpdateName}
                onChange={handleChangeName}
              />
            </div>
            {user.id === activeCustomer?.userActive ? (
              <button onClick={handleLeftSession}>Encerrar sessão</button>
            ) : (
              <>{returnIfUserActive()}</>
            )}
          </>
        ) : null}
      </header>
      <section className={styles.section} ref={refMain}>
        {messages?.map((message: MessageType) => (
          <Message message={message} key={message.id} />
        ))}
      </section>

      <form className={styles.inputView} onSubmit={sendMessage}>
        <input
          type="text"
          onChange={handleChange}
          value={message}
          placeholder="Digite aqui"
        />
        <button type="submit">
          <MdSend size={20} color="#fff" />
        </button>
      </form>
    </main>
  );
};

export default screen;
