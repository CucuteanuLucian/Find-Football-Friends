import { Avatar, Stack, Box, Button, Menu, MenuItem } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DeleteIcon from "@mui/icons-material/Delete";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import ThemeButton from "../ThemeButton/ThemeButton";
import { useState, useEffect } from "react";
import api from "../../api";
import MapIcon from "@mui/icons-material/Map";
import ChatIcon from "@mui/icons-material/Chat";

function NavBar() {
  const username = localStorage.getItem("username");
  const profile_picture = localStorage.getItem("profile_picture");

  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      const username = localStorage.getItem("username");
      try {
        const response = await api.get(
          `http://localhost:8000/not/get-notifications-for/${username}/`
        );
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetch notifications", error);
      }
    };

    fetchNotifications();

    const interval = setInterval(fetchNotifications, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleDeleteNotification = async (notificationId) => {
    try {
      await api.delete(
        `http://localhost:8000/not/delete-notification/${notificationId}/`
      );
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notif) => notif.id !== notificationId)
      );
    } catch (error) {
      console.error("eroare to delete notification:", error);
    }
  };
  const handleClearAllNotifications = async () => {
    const username = localStorage.getItem("username");

    try {
      await api.delete(
        `http://localhost:8000/not/delete-all-notifications/${username}/`
      );
      setNotifications([]);
    } catch (error) {
      console.error("err to delete all notifications:", error);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "#1E1E2F",
        px: { xs: "1rem", sm: "2rem", md: "3rem" },
        py: { xs: "0.5vh", sm: "1vh", md: "1.5vh" },
        minHeight: "9vh",
        display: "flex",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Stack
        direction="row"
        sx={{ justifyContent: "space-between", width: "100%" }}
        alignItems="center"
      >
        <Button
          href="/dashboard"
          sx={{
            fontFamily: "Oswald, sans-serif",
            fontWeight: "bold",
            fontSize: {
              xs: "1rem",
              sm: "1.2rem",
              md: "1.4rem",
            },
            textTransform: "none",
            minWidth: 0,
            width: {
              xs: "1.5rem",
              sm: "2.5rem",
              md: "3rem",
            },
            aspectRatio: "1 / 1",
            border: "2px solid",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
          }}
        >
          3F
        </Button>

        <Stack
          direction="row"
          spacing={{ xs: "0.5rem", sm: "1rem", md: "1.5rem" }}
          alignItems="center"
        >
          <ThemeButton />

          <Button
            href="/chats"
            sx={{
              fontSize: { xs: "0.75rem", sm: "0.9rem", md: "1rem" },
              textTransform: "none",
              minWidth: "auto",
              px: { xs: "0.4rem", sm: "0.6rem" },
            }}
          >
            <ChatIcon />
          </Button>

          <Button
            href="/map"
            sx={{
              fontSize: { xs: "0.75rem", sm: "0.9rem", md: "1rem" },
              textTransform: "none",
              minWidth: "auto",
              px: { xs: "0.4rem", sm: "0.6rem" },
            }}
          >
            <MapIcon />
          </Button>

          <Box
            sx={{
              fontSize: { xs: "0.75rem", sm: "0.9rem", md: "1rem" },
              textTransform: "none",
              minWidth: "auto",
            }}
          >
            <IconButton onClick={handleClick} sx={{ color: "#1864c4" }}>
              <Badge badgeContent={notifications.length} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              PaperProps={{
                sx: {
                  borderRadius: "0",
                  boxShadow: 5,
                  maxHeight: {
                    xs: "35vh",
                    sm: "35vh",
                    md: "30vh",
                    lg: "25vh",
                    xl: "25vh",
                  },
                  width: {
                    xs: "80vw",
                    sm: "60vw",
                    md: "40vw",
                    lg: "30vw",
                    xl: "25vw",
                  },
                  overflowY: "auto",
                  bgcolor: "#1E1E2F",
                  color: "#1864c4",
                  mt: 1,
                  border: "2px solid #1864c4",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                  justifyContent: "flex-start",
                },
              }}
              MenuListProps={{
                dense: true,
              }}
            >
              {notifications.length === 0 ? (
                <MenuItem onClick={handleClose}>No notifications</MenuItem>
              ) : (
                notifications.map((notif, index) => (
                  <MenuItem
                    key={index}
                    sx={{
                      border: "1px solid #1864c4",
                      borderRadius: "0.5rem",
                      mt: index === 0 ? 0 : { xs: 0.5, sm: 1 },
                      ml: { xs: 0.5, sm: 1 },
                      mr: { xs: 0.5, sm: 1 },
                      fontSize: { xs: "0.75rem", sm: "0.9rem", md: "1rem" },
                    }}
                  >
                    <Box sx={{ py: 1, width: "100%" }}>
                      <strong>{notif.sender}</strong>{" "}
                      {notif.notification_type === "match"
                        ? "matched with you"
                        : "sent you a message"}
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteNotification(notif.id)}
                    >
                      <DeleteIcon
                        sx={{
                          color: "#ff4444",
                          fontSize: { xs: "0.8rem", sm: "1rem" },
                        }}
                      />
                    </IconButton>
                  </MenuItem>
                ))
              )}
              {notifications.length > 0 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                  <Button
                    variant="contained"
                    size="medium"
                    color="error"
                    onClick={handleClearAllNotifications}
                    sx={{
                      textTransform: "none",
                      fontSize: { xs: "0.6rem", sm: "0.7rem", md: "0.8rem" },
                    }}
                  >
                    Clear All
                  </Button>
                </Box>
              )}
            </Menu>
          </Box>

          <Button href="/profile" sx={{ p: 0, minWidth: "auto" }}>
            <Avatar
              alt={username}
              src={"http://localhost:8000/api" + profile_picture}
              sx={{
                width: { xs: "2rem", sm: "2.4rem", md: "2.8rem" },
                height: { xs: "2rem", sm: "2.4rem", md: "2.8rem" },
              }}
            />
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

export default NavBar;
