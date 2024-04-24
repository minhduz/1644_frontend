import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Home from "./Routes/Home";
import NavigationBar from "./Component/NavBar";
import Login from "./Routes/Login";
import Register from "./Routes/Register";
import { Provider } from "react-redux";
import store from "./Redux/store";
import Footer from "./Component/Footer";
import Cart from "./Component/Cart";
import { getCurrentUser } from "./Component/User";
import Checkout from "./Routes/Order/checkOut";
import Orders from "./Routes/Order";
import Dashboard from "./Routes/Dashboard";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getCurrentUser().then(() => {
      setLoading(false);
    });
  }, []);

  return loading ? (
    ""
  ) : (
    <BrowserRouter>
      <NavigationBar />
      <Cart />
      <Routes>
        <Route index element={<Navigate to="/product" />} />
        <Route path="/product/*" element={<Home />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
