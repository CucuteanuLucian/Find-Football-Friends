import NavBar from "../../Components/NavBar/NavBar";
import SettingsApp from "../../Components/Settings/Settings";
import { Box } from "@mui/material";

function ProfileSettingsApp() {
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
        <SettingsApp />
      </Box>
    </Box>
  );
}

export default ProfileSettingsApp;
