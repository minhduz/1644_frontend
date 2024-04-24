import {
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  LinearProgress,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";

import { api_endpoint } from "../../config";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (evt) => {
    evt.preventDefault();
    console.log(email);
    console.log(password);
    setLoading(true);

    axios
      .post(
        `${api_endpoint}/auth/login`,
        {
          email: email,
          password: password,
        },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          setLoading(false);
          window.location.href = "/";
        }
      })
      .catch((err) => {
        if (err.response.data === "invalid request") {
          // Hiển thị thông báo email không hợp lệ
          alert("Email không hợp lệ.");
          setLoading(false);
        } else if (
          err.response.data === "Authentication error" ||
          err.response.data === "User not found"
        ) {
          alert("Sai mật khẩu hoặc tài khoản");
          setLoading(false);
        }
        console.log(err);
        return;
      });
  };

  return (
    <>
      {loading ? <LinearProgress /> : ""}
      <Container
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: "10px",
            border: "1px solid #D8D8D8",
            padding: "3%",
          }}
          maxWidth="sm"
        >
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleLogin}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={(evt) => {
                setEmail(evt.target.value);
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(evt) => {
                setPassword(evt.target.value);
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Next
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  Sign Up
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
}
