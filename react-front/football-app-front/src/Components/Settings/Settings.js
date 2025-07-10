import { FormHelperText, InputLabel } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { Box, Stack, Button } from "@mui/material";
import SearchTeam from "./SearchTeam";

const SettingsApp = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date_of_birth, setDate_of_birth] = useState("");
  const [gender, setGender] = useState("");
  const [profile_picture, setProfile_picture] = useState(
    localStorage.getItem("profile_picture")
  );
  const [rows, setRows] = useState(3);
  const [selectedTeam, setSelectedTeam] = useState(
    localStorage.getItem("team_name")
  );

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
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 350) {
        setRows(9);
      } else if (width < 410) {
        setRows(8);
      } else if (width < 450) {
        setRows(7);
      } else if (width < 500) {
        setRows(6);
      } else if (width < 600) {
        setRows(5);
      } else if (width < 640) {
        setRows(6);
      } else if (width < 800) {
        setRows(5);
      } else if (width < 900) {
        setRows(4);
      } else if (width < 1000) {
        setRows(7);
      } else if (width < 1200) {
        setRows(6);
      } else if (width < 1400) {
        setRows(5);
      } else if (width < 1800) {
        setRows(4);
      } else {
        setRows(3);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [max_distance, setMax_distance] = useState(50);
  const [goGlobal, setGoGlobal] = useState(false);
  useEffect(() => {
    if (profile_picture) {
      localStorage.setItem("profile_picture", profile_picture);
    }
  }, [profile_picture]);

  useEffect(() => {
    setName(localStorage.getItem("name"));
    setDescription(localStorage.getItem("description"));
    setDate_of_birth(localStorage.getItem("date_of_birth"));
    setGender(localStorage.getItem("gender"));
    setProfile_picture(localStorage.getItem("profile_picture"));
    setMax_distance(parseInt(localStorage.getItem("max_distance") || "50", 10));
    setGoGlobal(
      parseInt(localStorage.getItem("max_distance") || "50", 10) === 100000
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.setItem("name", name);
    localStorage.setItem("description", description);
    localStorage.setItem("date_of_birth", date_of_birth);
    localStorage.setItem("gender", gender);
    localStorage.setItem("max_distance", max_distance);
    localStorage.setItem("profile_picture", profile_picture);
    if (selectedTeam?.name) {
      localStorage.setItem("team_name", selectedTeam.name);
    }

    const payload = {
      name,
      description,
      date_of_birth: date_of_birth === "" ? null : date_of_birth,
      gender,
      max_distance,
      ...(selectedTeam?.name && { team_name: selectedTeam.name }),
    };
    console.log("Payload:", payload);

    try {
      const response = await api.patch(
        `api/user/${username}/settings/`,
        payload
      );
      console.log("Profil actualizat:", response.data);
      navigate("/profile");
    } catch (error) {
      console.error("Eroare la trimitere:", error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profile_picture", file);

    try {
      const response = await api.post(
        `api/user/${username}/upload_picture/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const imageUrl = response.data.profile_picture;
      setProfile_picture(imageUrl);
      console.log(imageUrl);
      localStorage.setItem("profile_picture", imageUrl);
      setProfile_picture(imageUrl);
    } catch (error) {
      console.error("Eroare la incarcare = ", error);
    }
  };

  //const apiToken =
  //"95POticCuXrZTbz4bQhLUilSifee2MUeTvpduRFTKNmaQqLvkwdyR2SSpjIt";

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
          color: "#fff",
          textAlign: "center",
          px: 2,
        }}
      >
        <form onSubmit={handleSubmit} className="form-container">
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
              xs: "80vw",
              sm: "60vw",
              md: "35vw",
            }}
            color="#000"
          >
            <h3>Edit Profile</h3>
            <InputLabel
              className="text-sm font-medium"
              sx={{ fontWeight: "bold", color: "#000" }}
            >
              Profile Picture URL
            </InputLabel>
            <Box
              sx={{
                width: {
                  xs: "30vw",
                  sm: "20vw",
                  md: "10vw",
                },
                height: {
                  xs: "30vw",
                  sm: "20vw",
                  md: "10vw",
                },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "1rem",
                border: "3px solid #c8a276",
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
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e)}
              style={{
                border: "3px solid #c8a276",
                width: "40%",
              }}
            />
            <InputLabel sx={{ fontWeight: "bold", color: "#000" }}>
              Name
            </InputLabel>
            <input
              className="form-input"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ border: "3px solid #c8a276", width: "30%" }}
            />

            <InputLabel sx={{ fontWeight: "bold", color: "#000" }}>
              Description
            </InputLabel>
            <textarea
              className="form-input"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={rows}
              maxLength="199"
              style={{
                width: "90%",
                resize: "none",
                border: "3px solid #c8a276",
              }}
            />

            <InputLabel
              className="text-sm font-medium"
              sx={{ fontWeight: "bold", color: "#000" }}
            >
              Choose your team
            </InputLabel>
            <SearchTeam onTeamSelect={setSelectedTeam} />

            <InputLabel sx={{ fontWeight: "bold", color: "#000" }}>
              Date of Birth
            </InputLabel>
            <FormHelperText
              className="text-sm font-medium"
              style={{
                display: "flex",
                justifyContent: "center",
                color: "#000",
              }}
            >
              (MM/ZZ/YYYY)
            </FormHelperText>
            <input
              className="form-input"
              type="date"
              value={date_of_birth}
              onChange={(e) => setDate_of_birth(e.target.value)}
              style={{ border: "3px solid #c8a276" }}
            />

            <InputLabel sx={{ fontWeight: "bold", color: "#000" }}>
              Gender
            </InputLabel>
            <select
              className="form-input"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              style={{ border: "3px solid #c8a276" }}
            >
              <option value="">Selectează genul</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <InputLabel
              className="text-sm font-medium"
              sx={{ fontWeight: "bold", color: "#000" }}
            >
              Max Distance: {max_distance} km
            </InputLabel>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={max_distance}
              onChange={(e) => setMax_distance(parseInt(e.target.value, 10))}
              className="w-full"
              disabled={goGlobal}
            />
            <Stack direction="row">
              <InputLabel sx={{ fontWeight: "bold", color: "#000" }}>
                Go Global
              </InputLabel>
              <input
                type="checkbox"
                checked={goGlobal}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  setGoGlobal(isChecked);
                  setMax_distance(isChecked ? 100000 : 50);
                }}
              />
            </Stack>
            <Button
              type="submit"
              variant="contained"
              sx={{ bgcolor: "green", mt: 2, width: "10%" }}
            >
              Save
            </Button>
          </Stack>
        </form>
      </Box>
    </Box>
  );
};

export default SettingsApp;
