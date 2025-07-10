import { useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";
import { Box, Typography, TextField, Button, Link } from "@mui/material";

function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [emailError, setEmailError] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [passwordMatchError, setPasswordMatchError] = useState(true);

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    localStorage.setItem("username", value);
    setEmailError(!isValidEmail(value));
  };

  const handlePasswordChange1 = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPassword1(value);
    if (method.toLowerCase() === "signup") {
      setPasswordMatchError(value !== password2);
    }
  };

  const handlePasswordChange2 = (e) => {
    const value = e.target.value;
    setPassword2(value);
    setPasswordMatchError(value !== password1);
  };

  const name = method === "login" ? "Login" : "Signup";

  const fetchUserDetails = async (username) => {
    try {
      const response = await api.get(`api/user/${username}/`);
      const data = await response.data;
      localStorage.setItem("name", data.name);
      localStorage.setItem("date_of_birth", data.date_of_birth);
      localStorage.setItem("description", data.description);
      localStorage.setItem("gender", data.gender);
      localStorage.setItem("profile_picture", data.profile_picture);
      localStorage.setItem("max_distance", data.max_distance);
      localStorage.setItem("latitude", data.latitude);
      localStorage.setItem("longitude", data.longitude);
      localStorage.setItem("theme", data.theme);
      localStorage.setItem("team_name", data.team_name);
    } catch (error) {
      console.error("err fetching user details:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (method === "signup" && password1 !== password2) {
      alert("Passwords do not match.");
      return;
    }

    if (emailError) {
      alert("Please enter a valid e-mail adress.");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post(route, { username, password });
      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        await fetchUserDetails(username);
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundImage: `
        linear-gradient(to bottom, rgba(0, 0, 0, 0) 70%, rgba(0, 0, 0, 1) 100%),
        url("/startpage.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        px: 2,
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          width: {
            xs: "90%",
            sm: "70%",
            md: "400px",
          },
          mx: "auto",
          px: {
            xs: 2,
            sm: 3,
            md: 4,
          },
          py: {
            xs: 3,
            sm: 4,
            md: 5,
          },
          backgroundColor: "rgba(245, 245, 245, 0.4)",
          borderRadius: 3,
          boxShadow: 3,
          backdropFilter: "blur(4px)",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontSize: {
              xs: "1.8rem",
              sm: "2rem",
              md: "2.2rem",
            },
          }}
        >
          {name}
        </Typography>

        <TextField
          fullWidth
          type="email"
          label="E-mail"
          variant="outlined"
          value={username}
          onChange={handleEmailChange}
          error={emailError}
          helperText={
            emailError ? "Enter a valid e-mail address (ex: name@site.com)" : ""
          }
        />

        <TextField
          fullWidth
          type="password"
          label="Password"
          variant="outlined"
          value={password1}
          error={method.toLowerCase() === "signup" ? passwordMatchError : false}
          onChange={handlePasswordChange1}
        />

        {name.toLowerCase() === "signup" && (
          <TextField
            fullWidth
            type="password"
            label="Confirm Password"
            variant="outlined"
            value={password2}
            error={passwordMatchError}
            onChange={handlePasswordChange2}
          />
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          sx={{
            py: {
              xs: 1.2,
              sm: 1.4,
              md: 1.6,
            },
            fontSize: {
              xs: "1rem",
              sm: "1.1rem",
              md: "1.15rem",
            },
          }}
          disabled={
            emailError ||
            loading ||
            (name.toLowerCase() === "signup" && passwordMatchError)
          }
        >
          {name}
        </Button>

        {name.toLowerCase() === "login" ? (
          <Box sx={{ textAlign: "center" }}>
            <Link href="/forgot-password" underline="hover" color="primary">
              Forgot password?
            </Link>
            <br />
            Don't have an account?{" "}
            <Link href="/signup" underline="hover" color="primary">
              Sign Up
            </Link>
          </Box>
        ) : (
          <Box sx={{ textAlign: "center" }}>
            Already have an account?{" "}
            <Link href="/login" underline="hover" color="primary">
              Log In
            </Link>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default Form;
