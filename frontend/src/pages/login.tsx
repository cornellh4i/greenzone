import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  ThemeProvider,
  createTheme,
} from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2a5548",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "4px",
        },
      },
    },
  },
});

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false); // added

  const login = async () => {
    const response = await fetch("http://localhost:8080/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Login successful:", data);
      window.location.href = "/landing"; // Redirect
    } else {
      setLoginError(true);
      const errorData = await response.json();
      console.error("Login failed:", errorData);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        {/* Left side - Form */}
        <Box
          sx={{
            width: { xs: "100%", md: "450px" },
            p: { xs: 3, md: 4 },
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h3" sx={{ color: "primary.main", fontWeight: "bold", mb: 4 }}>
            GreenZone Analytics
          </Typography>

          <Typography variant="h4" sx={{ fontWeight: 600, mb: 0.5 }}>
            Carrying Capacity Early Warning System
          </Typography>

          <Stack spacing={2.5} mt={2}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="small"
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              size="small"
            />
            {loginError && (
              <Typography variant="body2" color="error" sx={{ mb: 1 }}>
                Login failed, please enter a correct email and/or password.
              </Typography>
            )}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ py: 1.5, mt: 1 }}
              onClick={login}
            >
              Log In
            </Button>

            <Button
              variant="outlined"
              fullWidth
              sx={{ py: 1.5 }}
              onClick={() => alert("Google login coming soon")}
            >
              Continue with Google
            </Button>

            <Typography variant="body2" align="center">
              <Link href="/forgot-password" style={{ color: "#2a5548" }}>
                Forgot password?
              </Link>
            </Typography>

            <Typography variant="body2" align="center">
              Don’t have an account?{" "}
              <Link href="/sign-up" style={{ color: "#2a5548", fontWeight: "bold" }}>
                Sign Up for GreenZone
              </Link>
            </Typography>

            <Typography variant="body2" align="center" sx={{ mt: 2, color: "text.secondary" }}>
              OR
            </Typography>

            <Button
              variant="text"
              fullWidth
              sx={{ mt: 1, textDecoration: "underline", color: "#2a5548", fontWeight: "bold" }}
              onClick={() => window.location.href = "/landing"} // Adjust route as needed
            >
              Continue as guest
            </Button>
          </Stack>
        </Box>

        {/* Right side - Image */}
        <Box
          sx={{
            display: { xs: "none", md: "block" },
            flexGrow: 1,
            position: "relative",
          }}
        >
          <Image
            src="/mountain.png"
            alt="Scenic mountain road"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
