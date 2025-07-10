import NavBar from "../../Components/NavBar/NavBar";
import ProfileDetails from "../../Components/ProfileDetails/ProfileDetails";
import { Box } from "@mui/material";

function ProfileApp() {
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
        <ProfileDetails />
      </Box>
    </Box>
  );
}
export default ProfileApp;
