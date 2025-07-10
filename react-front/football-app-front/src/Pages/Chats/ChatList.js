import { useState, useEffect } from "react";
import { Avatar, Stack, Typography, Box, Button } from "@mui/material";
import api from "../../api";

function ChatsList() {
  const [username, setUsername] = useState(null);
  const [matchesList, setMatchesList] = useState([]);
  const [matchedUsersDetails, setMatchedUsersDetails] = useState([]);
  const [lil_window, setLil_window] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 800) {
        setLil_window(true);
      } else {
        setLil_window(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername);

    if (storedUsername) {
      const fetchMatches = async () => {
        try {
          const response = await api.get(`api/get-matches/${storedUsername}/`);
          const matchedUsernames = response.data.map((user) => ({
            username: user.username,
            room_id: user.room_id,
          }));
          setMatchesList(matchedUsernames);
        } catch (error) {
          console.error("Eroare matchuri:", error);
        }
      };

      fetchMatches();
    }
  }, [username]);

  useEffect(() => {
    if (matchesList.length > 0) {
      const fetchUserDetails = async () => {
        try {
          const userDetailsPromises = matchesList.map(async (match) => {
            const userResponse = await api.get(`/api/user/${match.username}/`);
            return { ...userResponse.data, room_id: match.room_id };
          });

          const userDetails = await Promise.all(userDetailsPromises);
          setMatchedUsersDetails(userDetails);
        } catch (error) {
          console.error("Eroare obt user:", error);
        }
      };

      fetchUserDetails();
    }
  }, [matchesList]);

  return (
    <Box
      sx={{
        height: "91vh",
        width: "20vw",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#1E1E2F",
        paddingTop: 1,
        paddingLeft: 0.2,
        paddingRight: 0.2,
        color: "#1864c4",
        borderTop: "3px solid #ffffff",
        borderRight: "3px solid #ffffff",
      }}
    >
      <Box sx={{ flexGrow: 1, display: "flex" }}>
        <Stack spacing={2} sx={{ flex: 1 }}>
          <Typography
            fontSize={{
              xs: "0.75rem",
              sm: "1rem",
              md: "1rem",
              lg: "1.5rem",
              xl: "2rem",
            }}
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: { xs: "column", sm: "row" },
              textAlign: "center",
            }}
          >
            Matches Chat
          </Typography>
          {matchedUsersDetails.map((user) => (
            <Stack
              key={user.username}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {!lil_window ? (
                <Button
                  variant="contained"
                  href={`/chats/${user.room_id}`}
                  sx={{ width: "11vw" }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar
                      src={`http://localhost:8000/api${user.profile_picture}`}
                      alt={user.username}
                    />
                    <Typography>{user.name}</Typography>
                  </Stack>
                </Button>
              ) : (
                <Button href={`/chats/${user.room_id}`}>
                  <Avatar
                    src={`http://localhost:8000/api${user.profile_picture}`}
                    alt={user.username}
                  />
                </Button>
              )}
            </Stack>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}

export default ChatsList;
