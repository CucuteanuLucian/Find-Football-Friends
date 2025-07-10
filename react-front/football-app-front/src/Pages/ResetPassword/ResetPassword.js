import { useState } from "react";
import { useParams } from "react-router-dom";
import { TextField, Button, Typography, Box, Alert } from "@mui/material";
import api from "../../api";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const { uid, token } = useParams();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      await api.post("/api/emails/reset-password-confirm/", {
        uid,
        token,
        new_password: password,
      });
      setMessage("Password reset success, redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError("Expired link or invalid token.");
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
        onSubmit={handleReset}
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
          Reset Password
        </Typography>

        {message && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <TextField
          label="New Password"
          type="password"
          fullWidth
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          onClick={handleReset}
          variant="contained"
          color="primary"
          size="small"
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
        >
          Reset Password
        </Button>
      </Box>
    </Box>
  );
};

export default ResetPassword;
