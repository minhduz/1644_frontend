import axios from "axios";
import { api_endpoint } from "../../config";

export default function logout() {
  axios
    .get(`${api_endpoint}/auth/signout`, { withCredentials: true })
    .then((res) => {
      if (res.status === 200) {
        window.location.href = "/";
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
