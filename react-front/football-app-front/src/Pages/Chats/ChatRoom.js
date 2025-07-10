import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  Avatar,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import api from "../../api";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SentimentNeutralIcon from "@mui/icons-material/SentimentNeutral";

const ChatRoom = ({ roomName, sender, receiver }) => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${roomName}/`);
    setSocket(ws);

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      const message = {
        sender: data.sender,
        receiver: data.receiver,
        content: data.content || data.message,
        timestamp: new Date().toLocaleTimeString(),
        is_read: false,
      };
      setChat((prev) => [...prev, message]);
    };

    return () => {
      ws.close();
    };
  }, [roomName, sender, receiver]);

  const sendMessage = () => {
    if (socket) {
      if (message === "") {
      } else {
        socket.send(
          JSON.stringify({
            sender: sender,
            receiver: receiver,
            message: message,
          })
        );
      }
      setMessage("");
    }
  };

  const [sentiment, setSentiment] = useState("");
  useEffect(() => {
    const fetchSentiment = async () => {
      try {
        const response = await api.get(
          `msg/get-messages/${sender}/${receiver}/`
        );
        if (response.status === 200) {
          const allData = response.data;
          const sentimentData = allData.pop();
          setChat(allData);
          setSentiment(sentimentData.sentiment["label"]);
        }
      } catch (error) {
        console.error("Eroare mesaje:", error);
      }
    };
    fetchSentiment();
  }, [sender, receiver]);
  const bottomRef = useRef(null);
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [chat]);
  const [receiverName, setReceiverName] = useState(null);
  const [receiverPhoto, setReceiverPhoto] = useState(null);

  useEffect(() => {
    const fetchReceiverDetails = async () => {
      try {
        const response = await api.get(`api/user/${receiver}/`);
        if (response.status === 200) {
          setReceiverName(response.data.name);
          setReceiverPhoto(response.data.profile_picture);
        } else {
          console.error(`Error, raspuns: (${response.status})`);
        }
      } catch (error) {
        console.error(`Eroare: ${receiver}:`, error);
      }
    };

    if (receiver) fetchReceiverDetails();
  }, [receiver]);

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();

  const handleConfirmUnmatch = async () => {
    try {
      const response = await api.delete(
        `api/delete-match/${sender}/${receiver}/`
      );

      if (response.status === 204) {
        setTimeout(() => {
          navigate("/chats");
        }, 2000);
      }
    } catch (error) {
      console.error("Failed to unmatch:", error);
    } finally {
      setOpen(false);
    }
  };

  return (
    <Box
      sx={{
        height: "91vh",
        width: "80vw",
        bgcolor: "#1864c4",
        borderTop: "3px solid #ffffff",
      }}
    >
      <Box
        height="87vh"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        width="78vw"
        borderRadius="2rem"
        bgcolor="#1E1E2F"
        margin="1vw"
      >
        <Box
          sx={{
            bgcolor: "#1E1E2F",
            width: "100%",
            height: "7vh",
            color: "#1864c4",
            display: "flex",
            paddingLeft: "2rem",
            paddingRight: "2rem",
            borderRadius: "1.75rem 1.75rem 0 0",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={{
              xs: 1,
              sm: 1.5,
              md: 2,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Avatar src={`http://localhost:8000/api${receiverPhoto}`} />
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                {receiverName}
              </Typography>
            </Stack>
            <Button
              variant="contained"
              color="error"
              sx={{
                height: "100%",
                width: "7vw",
                fontSize: {
                  xs: "0.6rem",
                  sm: "0.6rem",
                  md: "0.8rem",
                },
              }}
              onClick={handleClickOpen}
            >
              Unmatch
            </Button>
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>{"Are you sure you want to unmatch?"}</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  This action cannot be undone. You will no longer see or chat
                  with this user.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleConfirmUnmatch} color="error" autoFocus>
                  Unmatch
                </Button>
              </DialogActions>
            </Dialog>
          </Stack>

          <Typography
            backgroundColor="lightblue"
            sx={{
              height: "100%",
              aspectRatio: "1 / 1",
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              color: "black",
              justifyContent: "center",
              border: "3px solid #1E1E2F",
            }}
          >
            {sentiment === "positive" ? (
              <SentimentSatisfiedAltIcon />
            ) : sentiment === "neutral" ? (
              <SentimentNeutralIcon />
            ) : sentiment === "negative" ? (
              <SentimentVeryDissatisfiedIcon />
            ) : (
              "Unknown sentiment"
            )}
          </Typography>
        </Box>
        <List sx={{ overflowY: "auto", height: "100%" }}>
          {chat.map((msg, idx) => {
            const isOwnMessage = msg.sender === sender;
            return (
              <ListItem
                key={idx}
                alignItems="flex-start"
                sx={{
                  justifyContent: isOwnMessage ? "flex-end" : "flex-start",
                  textAlign: isOwnMessage ? "right" : "left",
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  {!isOwnMessage && (
                    <Avatar
                      src={`http://localhost:8000/api${receiverPhoto}`}
                      alt="Receiver Avatar"
                    />
                  )}
                  <Box
                    sx={{
                      backgroundColor: isOwnMessage ? "#1864c4" : "gray",
                      padding: "0.5rem",
                      borderRadius: "1rem",
                      maxWidth: {
                        xs: "50vw",
                        sm: "50vw",
                        md: "30vw",
                      },
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      {msg.content || msg.message}
                    </Typography>
                  </Box>
                </Stack>
              </ListItem>
            );
          })}
          <div ref={bottomRef} />
        </List>

        <Container
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "end",
            padding: "0.5rem",
            border: "1px solid #ccc",
            borderRadius: "1rem",
            marginBottom: "0.5rem",
            width: {
              xs: "90%",
              sm: "80%",
              md: "70%",
            },
          }}
        >
          <TextField
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            fullWidth
            variant="outlined"
            placeholder="Write a message..."
            sx={{
              color: "white",
              input: {
                color: "white",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "white",
                },
                "&:hover fieldset": {
                  borderColor: "white",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "white",
                },
              },
              marginRight: 1,
              width: "90%",
            }}
          />

          <Button
            variant="contained"
            onClick={sendMessage}
            sx={{
              marginRight: 1,
              height: "100%",
              width: {
                xs: "10vw",
                sm: "5vw",
                md: "3vw",
              },
            }}
          >
            Send
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default ChatRoom;
