import { useState } from "react";
import OutlineCard from "./OutlineCard";

const ChatCard = () => {
  const [messageListData, setMessageListData] = useState([]);

  function handleNewMessage(theMessage, position) {
    let title;
    position === "left" ? (title = "Third Eyes") : (title = "Yoo");

    const newMessage = {
      position: position,
      title: title,
      type: "text",
      text: theMessage,
      date: new Date(),
    };
  }

  return (
    <div>
      {messageListData.map((message, index) => (
        <OutlineCard
          key={index}
          position={message.position}
          title={message.title}
          type={message.type}
          text={message.text}
          date={message.date}
        />
      ))}
    </div>
  );
}

export default ChatCard;