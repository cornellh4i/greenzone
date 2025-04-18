import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Box,
  Button,
  TextField,
  Typography,
  ThemeProvider,
  createTheme,
} from "@mui/material";

// Reuse custom green theme
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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [suscess, setSuccess] = useState(false);
  const handleContinue = async () => {
    console.log('clickl')
    const response = await fetch("http://localhost:8080/api/can-reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      })
  
      if (response.ok) {
        console.log("Password reset email sent successfully")
        setSuccess(true)
        const data = await response.json()
      } else {
        const errorData = await response.json()
        console.error("Error signing up:", errorData)
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
          <Typography
            variant="h5"
            component="h1"
            sx={{ color: "primary.main", fontWeight: "bold", mb: 4 }}
          >
            GreenZone Analytics
          </Typography>

          <Typography variant="h6" component="h2" sx={{ fontWeight: 600, mb: 1 }}>
            Forgot your password?
          </Typography>
          <Typography variant="body2" sx={{ mb: 3 }}>
            Enter the email address associated with your account and we'll send you a code to reset your password.
          </Typography>
          {!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length > 0 && (
            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
              Please enter a valid email address.
            </Typography>
          )}

          <TextField
            fullWidth
            id="email"
            label="Email"
            variant="outlined"
            size="small"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
            {suscess && (
            <Typography variant="body2" sx={{ mb: 3, fontWeight: "bold" }}>
                Check your email to reset your password.
            </Typography>
            )}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              py: 1.5,
              bgcolor: "primary.main",
              "&:hover": { bgcolor: "#224539" },
            }}
            onClick={handleContinue}
          >
            Continue
          </Button>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2">
              Return to{' '}
              <Link href="/sign-up" style={{ color: "#2a5548", fontWeight: 500 }}>
                Sign In
              </Link>
            </Typography>
          </Box>
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
            src="/mountain.png" // replace with actual image path
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
