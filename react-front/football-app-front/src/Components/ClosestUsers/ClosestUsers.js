import { useEffect, useState, useRef } from "react";
import { useGesture } from "@use-gesture/react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Stack, Typography, Box, Button } from "@mui/material";
import api from "../../api";

function calculateAge(date) {
  if (!date) return null;
  const data_nastere = new Date(date);
  const acum = new Date();
  let age = acum.getFullYear() - data_nastere.getFullYear();
  const monthDiff = acum.getMonth() - data_nastere.getMonth();
  const dayDiff = acum.getDate() - data_nastere.getDate();
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }
  return age;
}

function ClosestUsers() {
  const username = localStorage.getItem("username");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const current = localStorage.getItem("theme") || "light";
      setTheme((prev) => (prev !== current ? current : prev));
    }, 300);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await api.get(`api/get-users-for/${username}/`);
        setUsers(response.data);
      } catch (error) {
        console.error("err fetching user details:", error);
      } finally {
        setTimeout(() => setLoading(false), 1000); // asteapta o sec
      }
    };

    if (username) fetchUserDetails();
  }, [username]);

  const handleSwipe = (user, direction) => {
    console.log(`Swiped ${direction} on`, user.name);

    setUsers((prevUsers) =>
      prevUsers.filter((u) => u.username !== user.username)
    );

    const payload = {
      user_from: username,
      user_to: user.username,
      swipe_type: direction === "right" ? "dislike" : "like",
    };

    api
      .post(`api/swipe-create/`, payload)
      .then((response) => {
        console.log("Swipe Creat:", response.data);
      })
      .catch((error) => {
        console.error("err la trimiterea date:", error);
      });
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        minHeight: "91vh",
      }}
    >
      <Box
        sx={{
          backgroundImage: {
            xs: `linear-gradient(to bottom, rgba(0, 0, 0, 0) 70%, rgba(0, 0, 0, 1) 100%),
        url(${
          theme === "dark" ? "/Porti-Mici-Noapte.png" : "/Porti-Mici-Zi.png"
        })`,
            sm: `linear-gradient(to bottom, rgba(0, 0, 0, 0) 70%, rgba(0, 0, 0, 1) 100%),
        url(${
          theme === "dark" ? "/Porti-Mici-Noapte.png" : "/Porti-Mici-Zi.png"
        })`,
            md: `linear-gradient(to bottom, rgba(0, 0, 0, 0) 70%, rgba(0, 0, 0, 1) 100%),
        url(${
          theme === "dark" ? "/Porti-Mari-Noapte.png" : "/Porti-Mari-Zi.png"
        })`,
          },

          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "relative",
          zIndex: 2,
          minHeight: "91vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          textAlign: "center",
          px: 2,
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: {
                xs: "70vw",
                sm: "40vw",
                md: "25vw",
                lg: "20vw",
                xl: "15vw",
              },
              height: {
                xs: "15vw",
                sm: "12vw",
                md: "9vw",
                lg: "6vw",
                xl: "3vw",
              },
              borderRadius: "20px",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
            }}
          >
            <Typography variant="h5" color="textSecondary">
              Searching for users...
            </Typography>
          </Box>
        ) : users.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: {
                xs: "70vw",
                sm: "40vw",
                md: "25vw",
                lg: "20vw",
                xl: "15vw",
              },
              height: {
                xs: "15vw",
                sm: "12vw",
                md: "9vw",
                lg: "6vw",
                xl: "3vw",
              },
              borderRadius: "20px",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
            }}
          >
            <Typography variant="h5" color="textSecondary">
              No users near you...
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              position: "relative",
              width: {
                xs: "70vw",
                sm: "40vw",
                md: "30vw",
                lg: "25vw",
                xl: "20vw",
              },
              height: {
                xs: "60vh",
                sm: "60vh",
                md: "65vh",
                lg: "65vh",
                xl: "65vh",
              },
            }}
          >
            {users.map((user, index) => (
              <SwipeCard
                key={user.username}
                user={user}
                onSwipe={handleSwipe}
                zIndex={users.length - index}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}

async function fetchTeamLogo(team_name) {
  if (team_name === "Unknown Team") return null;
  const response = await api.get(`api/get-team-photo/${team_name}/`);
  const team_logo = response.data.logo;
  return team_logo;
}

function SwipeCard({ user, onSwipe, zIndex }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-20, 20]);
  const cardRef = useRef();
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const handleSwipe = (direction) => {
    animate(x, direction === "right" ? swipeDistance : -swipeDistance, {
      duration: 0.3,
      ease: "easeOut",
      onComplete: () => onSwipe(user, direction),
    });
  };

  useEffect(() => {
    const updateWidth = () => {
      setScreenWidth(window.innerWidth);
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);

    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const swipeDistance = screenWidth * 0.2;

  const bind = useGesture({
    onDrag: ({ down, movement: [mx], last }) => {
      const maxDragDistance = swipeDistance * 0.4;
      const minSwipeThreshold = swipeDistance * 0.15;
      const limitedX = Math.max(
        -maxDragDistance,
        Math.min(mx, maxDragDistance)
      );

      if (!down && last) {
        if (Math.abs(limitedX) > minSwipeThreshold) {
          const direction = limitedX > 0 ? "right" : "left";
          animate(x, direction === "right" ? swipeDistance : -swipeDistance, {
            duration: 0.3,
            ease: "easeOut",
            onComplete: () => {
              onSwipe(user, direction);
              //x.set(0);
            },
          });
        } else {
          animate(x, 0, {
            duration: 0.2,
            ease: "easeOut",
          });
        }
      } else {
        x.set(limitedX);
      }
    },
  });

  const [teamLogo, setTeamLogo] = useState(null);
  useEffect(() => {
    async function fetchLogo() {
      const logo = await fetchTeamLogo(user.team_name);
      setTeamLogo(logo);
    }

    fetchLogo();
  }, [user.team_name]);

  return (
    <Box>
      <motion.div
        ref={cardRef}
        {...bind()}
        style={{
          x,
          rotate,
          touchAction: "none",
          zIndex,
          position: "absolute",
          width: "100%",
          height: "100%",
          border: "5px solid #c8a276",
          borderRadius: "2rem",
          backgroundColor: "#cab9aa",
          boxShadow: "0 1rem 1.5rem rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#000",
        }}
      >
        <Stack spacing={2} alignItems="center">
          <Box
            sx={{
              width: {
                xs: "50vw",
                sm: "29vw",
                md: "25vw",
                lg: "20vw",
                xl: "17vw",
              },
              height: {
                xs: "50vw",
                sm: "29vw",
                md: "25vw",
                lg: "20vw",
                xl: "17vw",
              },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "2rem",
              overflow: "hidden",
              border: "4px solid #c8a276",
            }}
          >
            <img
              src={"http://localhost:8000/api" + user.profile_picture}
              alt={user.username}
              style={{ pointerEvents: "none" }}
              width="100%"
              height="100%"
            />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {user.name}, {calculateAge(user.date_of_birth)}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            Distance: {user.distance} km
          </Typography>
          <Stack
            direction="row"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              allignItems: "center",
              width: "100%",
            }}
          >
            <Button
              variant="contained"
              onClick={() => handleSwipe("lefta")}
              sx={{
                borderRadius: "30%",
                bgcolor: "green",
                color: "#000",
                fontWeight: "bold",
                width: {
                  xs: "12vw",
                  sm: "10vw",
                  md: "7vw",
                  lg: "6vw",
                  xl: "5vw",
                },
                height: {
                  xs: "12vw",
                  sm: "10vw",
                  md: "7vw",
                  lg: "6vw",
                  xl: "5vw",
                },
              }}
            >
              Yes
            </Button>
            <Box
              sx={{
                width: {
                  xs: "12vw",
                  sm: "10vw",
                  md: "7vw",
                  lg: "6vw",
                  xl: "5vw",
                },
                height: {
                  xs: "12vw",
                  sm: "10vw",
                  md: "7vw",
                  lg: "6vw",
                  xl: "5vw",
                },
                border: "4px solid #c8a276",
                borderRadius: "1rem",
              }}
            >
              <img
                src={teamLogo}
                alt="Team Icon"
                style={{ height: "100%", pointerEvents: "none" }}
              />
            </Box>
            <Button
              variant="contained"
              onClick={() => handleSwipe("right")}
              sx={{
                bgcolor: "red",
                color: "#000",
                fontWeight: "bold",
                width: {
                  xs: "12vw",
                  sm: "10vw",
                  md: "7vw",
                  lg: "6vw",
                  xl: "5vw",
                },
                height: {
                  xs: "12vw",
                  sm: "10vw",
                  md: "7vw",
                  lg: "6vw",
                  xl: "5vw",
                },
                borderRadius: "30%",
              }}
            >
              No
            </Button>
          </Stack>
        </Stack>
      </motion.div>
    </Box>
  );
}

export default ClosestUsers;
