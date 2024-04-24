import { Close, Delete } from "@mui/icons-material";
import { AspectRatio } from "@mui/joy";
import {
  Box,
  Button,
  CssBaseline,
  Drawer,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { api_endpoint } from "../../config";
import { closeCart, setCartItems } from "../../Redux/cart";
import store from "../../Redux/store";

export default function Cart() {
  const { items, open, count } = useSelector((state) => state.cart);
  const navigate = useNavigate();

  const CartItem = ({ item }) => {
    const { name, thumbnailUrl, price, _id } = item.product;
    const [quantity, setQuantity] = useState(item.quantity);

    return (
      <Grid
        container
        padding="3%"
        boxShadow="rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px"
        borderRadius="4px"
        marginBottom="12px">
        <Grid item lg={4} borderRadius="4px" overflow="hidden">
          <AspectRatio ratio="1/1">
            <img alt="" src={thumbnailUrl} width="100%" />
          </AspectRatio>
        </Grid>
        <Grid item lg={1} />
        <Grid item lg={7}>
          <Box>
            <Typography
              variant="body1"
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis">
              {name}
            </Typography>
            <Typography variant="subtitle2" color="GrayText">
              ${price * quantity}
            </Typography>
          </Box>
          <Box display="flex" flexDirection="row" alignItems="center">
            <TextField
              variant="standard"
              type="number"
              step="0.01"
              min="0"
              value={quantity}
              onChange={(evt) => {
                setQuantity(evt.target.value);
                setTimeout(() => {
                  updateCartItemQuantity(_id, evt.target.value);
                }, 1000);
              }}
            />
            <IconButton
              onClick={() => {
                deleteCartItem(_id);
              }}>
              <Delete />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
    );
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() => {
        store.dispatch(closeCart());
      }}
      sx={{ height: "100vh", overflowY: "scroll" }}>
      <CssBaseline />
      <Box position="sticky" top="0" zIndex="10" bgcolor="#FFFFFF">
        <IconButton
          onClick={() => {
            store.dispatch(closeCart());
          }}>
          <Close />
        </IconButton>
      </Box>

      <Box width="30vw" paddingLeft="5%" paddingRight="5%" marginTop="5px">
        {items.map((item, index) => {
          return <CartItem item={item} key={index} />;
        })}
      </Box>

      {count === 0 ? (
        ""
      ) : (
        <Box
          position="sticky"
          marginTop="auto"
          bottom="0"
          zIndex="10"
          bgcolor="#FFFFFF"
          paddingTop="10px"
          paddingBottom="10px"
          width="100%"
          paddingLeft="5%"
          paddingRight="5%">
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => {
              store.dispatch(closeCart());
              navigate("/checkout");
            }}>
            Checkout
          </Button>
        </Box>
      )}
    </Drawer>
  );
}

export const fetchCart = async () => {
  await axios
    .get(`${api_endpoint}/cart`, { withCredentials: true })
    .then((res) => {
      if (res.status === 200) {
        const { items } = res.data;
        store.dispatch(setCartItems(items));
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

export const updateCartItemQuantity = (_id, quantity) => {
  axios
    .put(
      `${api_endpoint}/cart`,
      { product: _id, quantity: quantity },
      { withCredentials: true }
    )
    .then((res) => {
      if (res.status === 200) {
        const { items } = res.data;
        store.dispatch(setCartItems(items));
      }
    });
};

export const addItemToCart = async (_id) => {
  await axios
    .post(`${api_endpoint}/cart`, { product: _id }, { withCredentials: true })
    .then((res) => {
      if (res.status === 200) {
        const { items } = res.data;
        store.dispatch(setCartItems(items));
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

export const deleteCartItem = async (_id) => {
  await axios
    .delete(`${api_endpoint}/cart/${_id}`, { withCredentials: true })
    .then((res) => {
      if (res.status === 200) {
        const { items } = res.data;
        store.dispatch(setCartItems(items));
      }
    })
    .catch((err) => {
      console.log(err);
    });
};