import { useState } from "react";
import api from "../../api";
import { Box, Typography, TextField, Button } from "@mui/material";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("http://localhost:8000/api/emails/forgot-password/", {
        email,
      });
      setMsg("Verify email for password reset link.");
    } catch (err) {
      setMsg("Email not found.");
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
          Forgot Password?
        </Typography>
        <TextField
          fullWidth
          type="email"
          label="E-mail"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          helperText={"Enter a valid e-mail address (ex: name@site.com)"}
        />
        <Button
          onClick={handleSubmit}
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
          Send Email
        </Button>

        {msg && (
          <Typography
            variant="body2"
            color={msg === "Email not found." ? "red" : "green"}
          >
            {msg}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default ForgotPassword;
