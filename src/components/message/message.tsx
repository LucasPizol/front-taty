import styles from "./styles.module.css";

export type MessageType = {
  id: number;
  content: string;
  idCustomer: number;
  idUser: number;
  createdAt: Date;
  recieved: boolean;
  type?: string;
  media?: string;
};

type Props = {
  message: MessageType;
};

export const Message = ({ message }: Props) => {
  return (
    <div className={message.recieved ? styles.recieved : styles.sent}>
      {message.type?.includes("image") ? (
        <img src={"data:" + message.type + ";base64," + message.media} />
      ) : null}
      {message.type?.includes("audio") ? (
        <audio controls>
          <source src={"data:" + message.type + ";base64," + message.media} />
        </audio>
      ) : null}

      <p className={styles.message}>{message.content}</p>

      <p className={styles.date}>
        {new Date(message.createdAt).toLocaleDateString("pt-br", {
          day: "numeric",
          month: "numeric",
          hour: "numeric",
          minute: "numeric",
        })}
      </p>
    </div>
  );
};
