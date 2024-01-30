import styles from "./styles.module.css";
import { MdPerson } from "react-icons/md";
import { MessageType } from "../message/message";

export type CustomerType = {
  name: string;
  number: string;
  id: number;
  userActive: number | null;
  lastMessage: MessageType;
  notViewedMessages: any[];
};

type Props = {
  customer: CustomerType;
  setIsActive: any;
  activeCustomer?: CustomerType;
};

export const Customer = ({ customer, setIsActive, activeCustomer }: Props) => {
  const getLastMessage = (lastMessage: MessageType | undefined) => {
    if (!lastMessage) return "";

    if (lastMessage.recieved) {
      if (lastMessage.type !== "text") {
        return lastMessage.type?.toUpperCase().split("/")[0];
      }

      return lastMessage.content;
    }

    if (lastMessage.type !== "text") {
      return lastMessage.type?.toUpperCase().split("/")[0];
    }

    return "Você: " + lastMessage.content;
  };
  return (
    <div
      className={
        activeCustomer?.id === customer.id
          ? styles.customerActive
          : styles.customer
      }
      onClick={() => {
        setIsActive(customer);
      }}
    >
      <MdPerson size={40} className={styles.user} color="#00AB9B" />
      <div className={styles.info}>
        <p className={styles.customerName}>
          {customer.name ? customer.name : customer?.number?.split("@c.us")[0]}
        </p>
        <p className={styles.lastMessage}>
          {getLastMessage(customer.lastMessage)}
        </p>
      </div>
      {/* {findQuantity?.quantity === 0 || !findQuantity?.quantity ? null : (
        <p className={styles.notification}>{findQuantity.quantity}</p>
      )} */}
    </div>
  );
};
