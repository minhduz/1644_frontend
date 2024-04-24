import axios from "axios";
import { api_endpoint } from "../../config";
import store from "../../Redux/store";
import { setUser } from "../../Redux/user";
import { fetchCart } from "../Cart";

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${api_endpoint}/user`, { withCredentials: true })
      .then((res) => {
        if (res.status === 200) {
          store.dispatch(setUser({ singedIn: true, ...res.data }));
          fetchCart();
        }
        resolve();
      })
      .catch(() => {
        resolve();
      });
  });
};
