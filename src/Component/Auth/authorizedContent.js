import { useSelector } from "react-redux";

export default function AuthorizedContent({ children, requiredRole }) {
  const { singedIn, role } = useSelector((state) => state.user);

  let authorized = false;
  if (singedIn && role.includes(requiredRole)) {
    authorized = true;
  }

  return authorized ? children : "";
}
