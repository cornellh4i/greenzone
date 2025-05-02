import { useState, useEffect } from "react";
import { useRouter } from "next/router";
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
    primary: { main: "#2a5548" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", borderRadius: "4px" },
      },
    },
  },
});

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (router.query.email) {
      setEmail(router.query.email as string);
      console.log("Email from query:", email);
    }else{
        console.log("No email in query");
    }
  }, [router.query.email]);


  const changePassword = async () => {
    if (!email) {
      console.log("Missing email.");
      return;
    }

    if (newPassword !== confirmPassword) {
      console.log("Passwords do not match.");
      return;
    }

    const response = await fetch('http://localhost:8080/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          newPassword,
        }),
      });

    if (response.ok) {
      router.push("/login");
      console.log("Password changed successfully!");
    } else {
      //temporarily redirect to login page
      // this should be a page that says "password reset failed" and a button to go back to login
      const errorData = await response.json();
      console.error("Error:", errorData);
      console.log("Password reset failed.");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
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

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            Change your password
          </Typography>

          <Typography variant="body2" sx={{ mb: 3 }}>
            Create a new password for your account associated with{" "}
            <span style={{ color: "#2a5548", fontWeight: 500 }}>{email}</span>.
          </Typography>

          <Stack spacing={2.5}>
            <TextField
              fullWidth
              label="New password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              size="small"
            />
            <TextField
              fullWidth
              label="Confirm new password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              size="small"
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ py: 1.5, mt: 1 }}
              onClick={() => window.location.href = "/login" 
                //changePassword is supposed to be called here, but for now we just redirect to landing page
                }
            >
              Change Password
            </Button>
          </Stack>

          <Typography variant="body2" sx={{ mt: 3 }}>
            Return to{" "}
            <Link href="/land" style={{ color: "#2a5548", fontWeight: 500 }}>
              Sign In
            </Link>
          </Typography>
        </Box>

        {/* Right image */}
        <Box
          sx={{
            display: { xs: "none", md: "block" },
            flexGrow: 1,
            position: "relative",
          }}
        >
          <img
            src="/mountain.png"
            alt="Scenic mountain"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
