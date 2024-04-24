import { AddShoppingCart, ShoppingCart } from "@mui/icons-material";
import { AspectRatio } from "@mui/joy";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  CssBaseline,
  Grid,
  IconButton,
  LinearProgress,
  MenuItem,
  Pagination,
  Select,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";
import AuthorizedContent from "../../Component/Auth/authorizedContent";
import AuthorizedPage from "../../Component/Auth/authorizedPage";
import { addItemToCart } from "../../Component/Cart";
import { api_endpoint } from "../../config";
import ProductDetail from "../ProductDetail";
import EditProduct from "../ProductEdit";

export default function Home() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  // For pagination
  const productsPerPage = 20;
  const [pages, setPages] = useState(1);
  const [activePage, setActivePage] = useState(1);

  //For sorting
  const sortOptions = [
    { name: "Newest first", value: "dateAdded_desc" },
    { name: "Low price", value: "price_asc" },
    { name: "Name A to Z", value: "name_asc" },
  ];
  const [sorting, setSorting] = useState("dateAdded_desc");

  const fetchProducts = () => {
    window.scrollTo(0, 0);
    setLoading(true);
    axios
      .get(
        `${api_endpoint}/product?sort=${sorting}&skip=${
          productsPerPage * (activePage - 1)
        }&limit=${productsPerPage}`
      )
      .then((res) => {
        if (res.status === 200) {
          setProducts(res.data.data);
          setPages(Math.ceil(res.data.count / productsPerPage));
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, [activePage, sorting]);

  const ProductItem = ({ data }) => {
    const { _id, name, price, thumbnailUrl } = data;
    return (
      <Grid
        item
        lg={2.4}
        sx={{
          cursor: "pointer",
        }}
      >
        <Card
          variant="outlined"
          sx={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}
        >
          <Box
            onClick={() => {
              navigate(_id);
            }}
          >
            <AspectRatio ratio="1/1">
              <CardMedia image={thumbnailUrl} />
            </AspectRatio>
            <CardContent>
              <Typography
                variant="body"
                component="div"
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
              >
                {name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ${price}
              </Typography>
            </CardContent>
          </Box>
          <CardActions>
            <IconButton
              onClick={() => {
                addItemToCart(_id);
              }}
            >
              <AddShoppingCart color="primary" />
            </IconButton>
          </CardActions>
        </Card>
      </Grid>
    );
  };

  const AllProducts = () => {
    return (
      <>
        {loading ? <LinearProgress /> : ""}
        <Container sx={{ minHeight: "100vh" }}>
          <CssBaseline />
          <Box
            marginTop="20px"
            marginBottom="20px"
            display="flex"
            alignItems="center"
          >
            <Select
              variant="standard"
              value={sorting}
              onChange={(evt) => {
                setSorting(evt.target.value);
                setActivePage(1);
              }}
            >
              {sortOptions.map((item, index) => {
                return (
                  <MenuItem value={item.value} key={index}>
                    {item.name}
                  </MenuItem>
                );
              })}
            </Select>
            <Box width="1%" />
            <AuthorizedContent requiredRole="staff">
              <Button
                onClick={() => {
                  navigate("add");
                }}
                variant="outlined"
              >
                Add product
              </Button>
            </AuthorizedContent>
          </Box>
          <Grid container spacing={3}>
            {products.map((item, index) => {
              return <ProductItem data={item} key={index} />;
            })}
          </Grid>
          <Box
            display="flex"
            justifyContent="center"
            marginTop="20px"
            marginBottom="20px"
          >
            <Pagination
              color="primary"
              count={pages}
              page={activePage}
              onChange={(evt, value) => {
                setActivePage(value);
              }}
            />
          </Box>
        </Container>
      </>
    );
  };

  return (
    <Routes>
      <Route index element={<AllProducts />}></Route>
      <Route path=":productId" element={<ProductDetail />} />
      <Route
        path=":productId/edit"
        element={
          <AuthorizedPage requiredRole="staff">
            <EditProduct />
          </AuthorizedPage>
        }
      />
      <Route
        path="add"
        element={
          <AuthorizedPage requiredRole="staff">
            <EditProduct />
          </AuthorizedPage>
        }
      />
    </Routes>
  );
}
