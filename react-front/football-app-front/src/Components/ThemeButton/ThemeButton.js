import { useState, useMemo } from "react";
import {
  Button,
  useTheme,
  createTheme,
  ThemeProvider,
  CssBaseline,
} from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import api from "../../api";

const ThemeButton = ({ toggleTheme }) => {
  const theme = useTheme();

  const imageSrc =
    theme.palette.mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />;

  return (
    <Button onClick={toggleTheme} variant="contained">
      {imageSrc}
    </Button>
  );
};

const ThemeChanger = () => {
  const username = localStorage.getItem("username");
  const [mode, setMode] = useState(localStorage.getItem("theme"));
  const toggleTheme = async () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("theme", newMode);

    try {
      await api.patch(`api/user/${username}/settings/`, {
        theme: newMode,
      });
    } catch (error) {
      console.error("Eroare la tema:", error);
    }
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode,
        },
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ThemeButton toggleTheme={toggleTheme} />
    </ThemeProvider>
  );
};

export default ThemeChanger;
