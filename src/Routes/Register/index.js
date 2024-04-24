import {
  Box,
  Button,
  Container,
  CssBaseline,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { api_endpoint } from "../../config";

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordRepeat: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = (evt) => {
    evt.preventDefault();

    if (errorMsg !== "") return;

    setLoading(true);

    axios
      .post(
        `${api_endpoint}/auth/signup`,
        {
          email: formData.email,
          password: formData.password,
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
        } else if (err.response.data === "User Exsited") {
          alert("Người dùng đã tồn tại");
          setLoading(false);
        }
        console.log(err);
        return;
      });
  };

  useEffect(() => {
    if (formData.password !== formData.passwordRepeat) {
      setErrorMsg("Password not match!");
    } else {
      setErrorMsg("");
    }
  }, [formData.passwordRepeat, formData.password]);

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
            Create an account
          </Typography>
          <Box
            component="form"
            onSubmit={handleRegister}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Address"
              autoFocus
              onChange={(evt) => {
                setFormData({ ...formData, email: evt.target.value });
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              onChange={(evt) => {
                setFormData({ ...formData, password: evt.target.value });
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Repeat password"
              type="password"
              onChange={(evt) => {
                setFormData({ ...formData, passwordRepeat: evt.target.value });
              }}
              error={!(errorMsg === "")}
              helperText={errorMsg}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Next
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
}
