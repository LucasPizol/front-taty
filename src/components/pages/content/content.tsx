import { useEffect, useRef, useState } from "react";
import { Aside } from "../../aside/aside";
import { Screen } from "../../screen/screen";
import styles from "./styles.module.css";
import { io } from "../../../App";
import { CustomerType } from "../../customer/customer";
import axios from "axios";
import { MessageType } from "../../message/message";
import { useAuthContext } from "../../context/AuthContext";

const getCustomers = async (): Promise<CustomerType[]> => {
  const token = sessionStorage.getItem("AUTH_SESSION_KEY");
  const { data } = await axios.get(import.meta.env.VITE_HOST_KEY + "/customer", {
    headers: { Authorization: "Bearer " + token },
  });

  return data.data;
};

export const Content = () => {
  const [activeCustomer, setActiveCustomer] = useState<CustomerType>();
  const [customers, setCustomers] = useState<CustomerType[]>();
  const [messages, setMessages] = useState<any>([]);
  const [qrcode, setQrcode] = useState<string>();
  const { user } = useAuthContext();
  const customerRef = useRef(activeCustomer);
  const customersRef = useRef(customers);
  const messagesRef = useRef(messages);

  useEffect(() => {
    getCustomers().then((customers) => {
      customersRef.current = customers;
      setCustomers(customers);
    });
  }, []);

  useEffect(() => {
    io.emit("save_socket", user.id);

    io.on(
      "recieved_message",
      (message: MessageType, customer: CustomerType) => {
        console.log(customer)
        const customersRefCopy = customersRef.current
          ? [...customersRef.current]
          : [];

        if (customersRef.current) {
          const findIndex = customersRef?.current?.findIndex(
            (customer) => customer.id === message.idCustomer
          );

          const newCustomer = {
            ...customer,
            lastMessage: message,
          };

          customersRefCopy[findIndex] = newCustomer;
          customersRef.current = customersRefCopy;
          setCustomers(customersRefCopy);
        } else {
          const newCustomer = {
            ...customer,
            lastMessage: message,
            userActive: user.id
          };

          customersRefCopy.push(newCustomer);

          customersRef.current = customersRefCopy;
          setCustomers(customersRefCopy);
        }

        if (message.idUser === customerRef.current?.userActive) {
          const messagesCopy = [...messagesRef.current, message];

          messagesRef.current = messagesCopy;
          setMessages(messagesCopy);
        }
      }
    );

    io.on("qr", (qr: string) => {
      setQrcode(qr);
      console.log("a");
    });

    io.on("scanned", () => {
      setQrcode(undefined);
    });
  }, [io]);

  const handleChangeActive = async (customer: CustomerType) => {
    const token = sessionStorage.getItem("AUTH_SESSION_KEY");
    const { data, status } = await axios.get(
      import.meta.env.VITE_HOST_KEY + `/message?idCustomer=${customer.id}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    if (status === 400) return;

    customerRef.current = customer;
    messagesRef.current = data.messages;
    setActiveCustomer(customer);
    setMessages(data.messages);
  };

  if (qrcode) {
    return (
      <main className={styles.main} style={{flexDirection: "column", gap: "10px"}}>
        <h1>Escaneie pelo seu WhatsApp!</h1>
        <img src={qrcode} />
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <Aside
        activeCustomer={activeCustomer}
        customers={customers}
        handleChangeActive={handleChangeActive}
      />
      <Screen
        messages={messages}
        activeCustomer={activeCustomer}
        setMessages={setMessages}
        setCustomers={setCustomers}
        messagesRef={messagesRef}
        customers={customers}
        customersRef={customersRef}
        setActiveCustomer={setActiveCustomer}
      />
    </main>
  );
};
