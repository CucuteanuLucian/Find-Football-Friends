import NavBar from "../../Components/NavBar/NavBar";
import ClosestUsers from "../../Components/ClosestUsers/ClosestUsers";
import { Box } from "@mui/material";

function Dashboard() {
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
        <ClosestUsers />
      </Box>
    </Box>
  );
}

export default Dashboard;
