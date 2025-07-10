import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NotFoundApp from "../NotFound/NotFound";
import ChatRoom from "./ChatRoom";
import api from "../../api";
import { Box } from "@mui/material";

const ChatMessages = () => {
  const { roomID } = useParams();
  const [roomExists, setRoomExists] = useState(null);
  const username = localStorage.getItem("username");
  const [receiver, setReceiver] = useState(null);

  useEffect(() => {
    const checkRoom = async () => {
      try {
        const response = await api.get(`api/get-matches/${username}/`);
        if (response.status === 200) {
          const match = response.data.find((match) => match.room_id === roomID);
          if (match) {
            setReceiver(match.username);
            setRoomExists(match);
          } else {
            setRoomExists(false);
          }
        } else {
          setRoomExists(false);
        }
      } catch (error) {
        console.error("Eroare matchuri:", error);
        setRoomExists(false);
      }
    };

    checkRoom();
  }, [roomID, username]);

  if (roomExists === null) {
    return <Box>Loading..</Box>;
  }

  if (roomExists) {
    return <ChatRoom roomName={roomID} sender={username} receiver={receiver} />;
  } else {
    return <NotFoundApp />;
  }
};

export default ChatMessages;
