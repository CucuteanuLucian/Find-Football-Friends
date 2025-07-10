import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Stack, Box, Button, Typography } from "@mui/material";
import api from "../../api";

function ProfileDetails() {
  const [profile_picture, setProfile_picture] = useState(
    localStorage.getItem("profile_picture")
  );
  const [name, setName] = useState(null);
  const [gender, setGender] = useState(null);
  const [date_of_birth, setDate_of_birth] = useState(null);
  const [description, setDescription] = useState(null);
  const [max_distance, setMax_distance] = useState(null);
  const [team_name, setTeam_name] = useState(null);
  const [teamLogo, setTeamLogo] = useState(null);

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
    setProfile_picture(localStorage.getItem("profile_picture"));
    setName(localStorage.getItem("name"));
    setDate_of_birth(localStorage.getItem("date_of_birth"));
    setDescription(localStorage.getItem("description"));
    setGender(localStorage.getItem("gender"));
    setMax_distance(localStorage.getItem("max_distance"));
    setTeam_name(localStorage.getItem("team_name"));
  }, []);

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

  useEffect(() => {
    setTeam_name(localStorage.getItem("team_name"));
  }, []);

  useEffect(() => {
    if (!team_name) return;

    const fetchTeamLogo = async () => {
      try {
        const response = await api.get(`api/get-team-photo/${team_name}/`);
        setTeamLogo(response.data.logo);
        localStorage.setItem("team_logo", response.data.logo);
      } catch (error) {
        console.error("Eroare la incarcare logo:", error);
      }
    };

    fetchTeamLogo();
  }, [team_name]);

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
            xs: `url(${
              theme === "dark" ? "/Profil-Mic-Noapte.png" : "/Profil-Mic-Zi.png"
            })`,
            sm: `url(${
              theme === "dark" ? "/Profil-Mic-Noapte.png" : "/Profil-Mic-Zi.png"
            })`,
            md: `url(${
              theme === "dark"
                ? "/Profil-Mare-Noapte.png"
                : "/Profil-Mare-Zi.png"
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
          color: "#000",
          textAlign: "center",
          px: 2,
        }}
      >
        <Stack
          alignItems="center"
          spacing={{
            xs: 0.1,
            sm: 0.3,
            md: 0.5,
          }}
          backgroundColor="#cab9aa"
          p={2}
          borderRadius="1rem"
          border={"5px solid #c8a276"}
          width={{
            xs: "80%",
            sm: "60%",
            md: "35%",
          }}
        >
          <Box
            sx={{
              width: {
                xs: "35vw",
                sm: "25vw",
                md: "15vw",
              },
              height: {
                xs: "35vw",
                sm: "25vw",
                md: "15vw",
              },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "1rem",
              border: "4px solid #c8a276",
              overflow: "hidden",
            }}
          >
            <img
              src={"http://localhost:8000/api" + profile_picture}
              alt={name}
              style={{ pointerEvents: "none" }}
              width="100%"
              height="100%"
            />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {name}, {calculateAge(date_of_birth)}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Description
          </Typography>
          <Typography
            variant="body2"
            sx={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {description || "No description"}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Team
          </Typography>
          <Stack direction="row">
            <Typography variant="body2">
              {team_name || "No team assigned"}
            </Typography>
            <Box sx={{ width: "20px", height: "20px" }}>
              <img src={teamLogo} alt="Team Icon" style={{ height: "100%" }} />
            </Box>
          </Stack>

          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Gender
          </Typography>
          <Typography variant="body2">{gender}</Typography>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Max Distance
          </Typography>
          <Typography variant="body2">{max_distance} km</Typography>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Date of Birth
          </Typography>
          <Typography variant="body2">{date_of_birth}</Typography>
          <Link to="/profile/settings">
            <Button
              variant="contained"
              sx={{
                bgcolor: "green",
                py: {
                  xs: 1,
                  sm: 1.2,
                  md: 1.4,
                },
                fontSize: {
                  xs: "0.6rem",
                  sm: "0.7rem",
                  md: "0.8rem",
                },
              }}
            >
              Edit Profile
            </Button>
          </Link>
        </Stack>
        <Box sx={{ position: "absolute", bottom: 15, width: "100%" }}>
          <Link to="/logout" sx={{}}>
            <Button variant="contained" sx={{ bgcolor: "red" }}>
              Logout
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
}

export default ProfileDetails;
