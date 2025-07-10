import React from "react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { Box, Typography, Button, Stack, Container } from "@mui/material";

function StartpageApp() {
  const navigate = useNavigate();

  useEffect(() => {
    const refresh = localStorage.getItem("refresh");
    if (refresh) {
      api
        .post("api/token/refresh/", { refresh })
        .then((res) => {
          localStorage.setItem("access", res.data.access);
          navigate("/dashboard");
        })
        .catch((err) => {
          console.log("Invalid or expired token");
        });
    }
  }, [navigate]);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          backgroundImage: `
          linear-gradient(to bottom, rgba(0, 0, 0, 0) 70%, rgba(0, 0, 0, 1) 100%),
          url("/startpage.jpg")
        `,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          overflow: "hidden",
          position: "relative",
          zIndex: 2,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          textAlign: "center",
          px: 2,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            mb: 2,
            fontSize: {
              xs: "1.8rem",
              sm: "2.4rem",
              md: "3rem",
            },
            textShadow: `
          -1px -1px 0 #1E1E2F,
           1px -1px 0 #1E1E2F,
          -1px  1px 0 #1E1E2F,
           1px  1px 0 #1E1E2F
        `,
          }}
        >
          Find Football Friends
        </Typography>

        <Typography
          variant="h6"
          sx={{
            mb: 4,
            fontSize: {
              xs: "1rem",
              sm: "1.2rem",
              md: "1.5rem",
            },
            textShadow: `
          -1px -1px 0 #1E1E2F,
           1px -1px 0 #1E1E2F,
          -1px  1px 0 #1E1E2F,
           1px  1px 0 #1E1E2F
        `,
          }}
        >
          Swipe. Chat. Watch Football.
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center">
          <Button
            component={Link}
            to="/login"
            variant="contained"
            color="primary"
            sx={{
              fontSize: {
                xs: "0.75rem",
                sm: "0.9rem",
                md: "1rem",
              },
              px: {
                xs: 2,
                sm: 3,
                md: 4,
              },
              py: {
                xs: 1,
                sm: 1.25,
                md: 1.5,
              },
            }}
          >
            Login
          </Button>

          <Button
            component={Link}
            to="/signup"
            variant="contained"
            color="primary"
            sx={{
              fontSize: {
                xs: "0.75rem",
                sm: "0.9rem",
                md: "1rem",
              },
              px: {
                xs: 2,
                sm: 3,
                md: 4,
              },
              py: {
                xs: 1,
                sm: 1.25,
                md: 1.5,
              },
            }}
          >
            Signup
          </Button>
        </Stack>
      </Box>

      <Box
        component="footer"
        sx={{
          width: "100%",
          backgroundColor: "#000",
          color: "#fff",
          py: 4,
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="body2"
            sx={{
              mb: { xs: 2, sm: 1 },
              fontSize: {
                xs: "0.75rem", // mobil
                sm: "0.85rem", // tableta
                md: "0.95rem", // desktop
              },
              textAlign: "center",
            }}
          >
            © {new Date().getFullYear()} Find-Football-Friends. All rights
            reserved.
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1, sm: 3 }}
            justifyContent="center"
            alignItems="center"
          >
            <Link
              to="/privacy"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Terms of Service
            </Link>
            <Link
              to="/contact"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Contact
            </Link>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

export default StartpageApp;
