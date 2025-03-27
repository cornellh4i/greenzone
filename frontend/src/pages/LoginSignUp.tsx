
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Stack,
  TextField,
  Typography,
  ThemeProvider,
  createTheme,
} from "@mui/material"

// Create a custom theme with the green color
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
})

export default function SignUpPage() {
  const [role, setRole] = useState("Student")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

 
  const handleRoleChange = (event: SelectChangeEvent) => {
    setRole(event.target.value)
  }
  const signUp = async () => {
    const response = await fetch("http://localhost:8080/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })

    if (response.ok) {
      const data = await response.json()
      console.log("User signed up successfully:", data)
    } else {
      const errorData = await response.json()
      console.error("Error signing up:", errorData)
    }
  }


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
          <Typography variant="h5" component="h1" sx={{ color: "primary.main", fontWeight: "bold", mb: 4 }}>
            GreenZone Analytics
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 600, mb: 0.5 }}>
              Sign Up for GreenZone
            </Typography>
            <Typography variant="body2" sx={{ mb: 3 }}>
              Welcome to GreenZone&apos;s Early Warning Carrying Capacity System!
            </Typography>

            <Stack spacing={2.5}>
              {/* Name fields in a flex container instead of Grid */}

             

                <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  fullWidth
                  id="firstName"
                  label="First Name"
                  variant="outlined"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  size="small"
                />
                <TextField
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  variant="outlined"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  size="small"
                />
                </Box>

                <TextField
                fullWidth
                id="email"
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size="small"
                error={email !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
                helperText={
                  email !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                  ? "Please enter a valid email address"
                  : ""
                }
                />

                <TextField
                fullWidth
                id="password"
                label="Password"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                size="small"
                />

              <FormControl fullWidth size="small">
                <InputLabel id="role-label">Role / Occupation</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  value={role}
                  label="Role / Occupation"
                  onChange={handleRoleChange}
                >
                  <MenuItem value="Student">Student</MenuItem>
                  <MenuItem value="Teacher">Teacher</MenuItem>
                  <MenuItem value="Researcher">Researcher</MenuItem>
                  <MenuItem value="Professional">Professional</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>

                <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  py: 1.5,
                  mt: 1,
                  bgcolor: "primary.main",
                  "&:hover": {
                  bgcolor: "#224539",
                  },
                }}
                onClick={async () => {
                  if (email && password) {
                  await signUp();
                  window.location.href = "/login"; // Redirect to the login page
                  }
                }}
                >
                Sign Up
                </Button>

              <Typography variant="caption" sx={{ mt: 1 }}>
                By signing up, you accept GreenZone Analytics&apos;
                <Link href="#" style={{ color: "#2a5548", marginLeft: "4px", marginRight: "4px" }}>
                  Terms of Service
                </Link>
                and
                <Link href="#" style={{ color: "#2a5548", marginLeft: "4px" }}>
                  Privacy Policy
                </Link>
                .
              </Typography>
            </Stack>

            <Box sx={{ mt: 4, textAlign: "center" }}>
              <Typography variant="body2">
                <strong>Already have an account?</strong>
                <Link href="/login" style={{ color: "#2a5548", marginLeft: "4px", fontWeight: 500 }}>
                  Sign In
                </Link>
              </Typography>
            </Box>
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
            src= "/mountain.png" // Replace with your actual image path inside public/
            alt="Scenic mountain road"
            fill
            style={{ objectFit: "cover" }}
            priority
        />
</Box>

      </Box>
    </ThemeProvider>
  )
}

