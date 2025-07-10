import NavBar from "../../Components/NavBar/NavBar";
import Map from "./Map";
import { Box } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import api from "../../api";

const MapApp = () => {
  const userLat = localStorage.getItem("latitude");
  const userLon = localStorage.getItem("longitude");
  const username = localStorage.getItem("username");
  const [users, setUsers] = useState([]);
  const [closeUsers, setCloseUsers] = useState([]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await api.get(`api/get-users-for/${username}/`);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    if (username) fetchUserDetails();
  }, [username]);

  const fetchTeamLogo = async (teamName) => {
    try {
      const response = await api.get(`api/get-team-photo/${teamName}/`);
      return response.data.logo;
    } catch (error) {
      console.error(`Eroare logo ${teamName}:`, error);
      return null;
    }
  };

  useEffect(() => {
    const fetchCloseUsers = async () => {
      const usersWithLogos = await Promise.all(
        users.map(async (user) => ({
          lat: user.latitude,
          lon: user.longitude,
          name: user.name || user.username || "No Name",
          team_logo: await fetchTeamLogo(user.team_name),
        }))
      );
      setCloseUsers(usersWithLogos);
    };

    if (users.length) fetchCloseUsers();
  }, [users]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Box sx={{ height: "9vh" }}>
        <NavBar />
      </Box>
      <Box sx={{ flexGrow: 1, minHeight: 0 }}>
        <Map userLat={userLat} userLon={userLon} points={closeUsers} />
      </Box>
    </Box>
  );
};

export default MapApp;
