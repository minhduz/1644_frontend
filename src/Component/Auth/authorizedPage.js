import { Container } from "@mui/material";
import { useSelector } from "react-redux";
import { Navigate, redirect, useNavigate } from "react-router-dom";

export default function AuthorizedPage({ children, requiredRole }) {
  const { singedIn, role } = useSelector((state) => state.user);
  const navigate = useNavigate();

  if (!singedIn) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && !role.includes(requiredRole)) {
    setTimeout(() => {
      navigate("/");
    }, 1000);
    return (
      <Container
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <h4>You are not allowed to view this page!</h4>
      </Container>
    );
  }

  return children;
}
