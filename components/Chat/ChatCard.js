import { useState, useEffect } from "react";
import Card from "@mui/material/Card";

const ChatCard = (props) => {
  const { text, position, date, initTime, newCardAdded } = props;

  const [displayedTime, setDisplayedTime] = useState(date);
  const [updatedNewCardAdded, setUpdatedNewCardAdded] = useState(newCardAdded);
  const [displayedSeconds, setDisplayedSeconds] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDisplayedTime(Date.now());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const timeDiff = Math.floor((displayedTime - date) / 1000);
  const minutes = Math.floor(timeDiff / 60);
  const seconds = timeDiff % 60;

  useEffect(() => {
    setUpdatedNewCardAdded(newCardAdded)
    setDisplayedSeconds(seconds)
    console.log('displayedSeconds', displayedSeconds)
  }, [newCardAdded])

  return (
    <>
      <Card
        variant="outlined"
        className={`chat-card chat-card--${position}`}
      >
        <h5>{position === 0 ? "Third Eyes" : "Human"}</h5>
        <p>{text}</p>
        {/* <p>
          {minutes === 0
            ? `${seconds} seconds ago`
            : `${minutes} minutes, ${seconds} seconds ago`}
        </p> */}
      </Card>
    </>
  );
};

export default ChatCard;
