import styles from "./styles.module.css";
import axios from "axios";
import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import { api_endpoint } from "../../config";
import AuthorizedContent from "../../Component/Auth/authorizedContent";
import {
  Button,
  Container,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Skeleton,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { Delete, ModeEdit } from "@mui/icons-material";
import { AspectRatio } from "@mui/joy";
import { addItemToCart } from "../../Component/Cart";

export default function ProductDetail() {
  const { productId } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState();
  const [data, setData] = useState({});

  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchData = () => {
    setLoading(true);
    axios
      .get(`${api_endpoint}/product/${productId}`)
      .then((res) => {
        if (res.status === 200) {
          setData({ ...res.data });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeleteProduct = () => {
    setDeleting(true);
    axios
      .delete(`${api_endpoint}/product/${productId}`, { withCredentials: true })
      .then((res) => {
        if (res.status === 200) {
          navigate(-1);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const LoadingSkeleton = () => {
    return (
      <Container>
        <Grid container padding="2%" marginTop="10px">
          <Grid item lg={4}>
            <AspectRatio ratio="1/1">
              <Skeleton variant="rounded" width="100%" />
            </AspectRatio>
          </Grid>
          <Grid item lg={1} />
          <Grid
            item
            lg={6}
            display="flex"
            flexDirection="column"
            justifyContent="center"
          >
            <Skeleton variant="rounded" width="90%" />
            <Box height="10px" />
            <Skeleton variant="rounded" width="75%" />
            <Box height="40px" />
            <Skeleton variant="rounded" width="20%" />
          </Grid>
          <Grid item lg={1} />
        </Grid>
        <Box paddingLeft="2%" paddingRight="2%" marginTop="10px">
          <Skeleton variant="rounded" width="100%" height="500px" />
        </Box>
      </Container>
    );
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
  }, []);

  return (
    <Box minHeight="100vh">
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <Container>
          <CssBaseline />
          <Grid
            container
            marginTop="30px"
            padding="2%"
            boxShadow="rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px"
            borderRadius="6px"
          >
            <Grid
              item
              lg={4}
              borderRadius="10px"
              overflow="hidden"
              boxShadow=""
            >
              <AspectRatio ratio="1/1">
                <img alt="" src={data.thumbnailUrl} width="100%" />
              </AspectRatio>
            </Grid>
            <Grid item lg={1} />
            <Grid
              item
              lg={6}
              display="flex"
              flexDirection="column"
              justifyContent="center"
            >
              <Typography variant="h5">{data.name}</Typography>
              <div style={{ height: "10px" }} />
              <Typography variant="body1">${data.price}</Typography>
              <div style={{ height: "10px" }} />
              <Box display="flex" alignItems="center">
                <Button
                  variant="contained"
                  sx={{
                    boxShadow:
                      "box-shadow: rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;",
                  }}
                  onClick={() => {
                    addItemToCart(productId);
                  }}
                >
                  Add to cart
                </Button>
                <Box width="10px" />
                <Typography variant="caption">
                  {data.stock} items available
                </Typography>
              </Box>
            </Grid>
            <Grid
              item
              lg={1}
              display="flex"
              alignItems="flex-end"
              justifyContent="flex-end"
            >
              <AuthorizedContent requiredRole="staff">
                <IconButton
                  color="info"
                  onClick={() => {
                    navigate("edit");
                  }}
                >
                  <ModeEdit />
                </IconButton>
                <div style={{ height: "8px" }} />
                <IconButton
                  color="error"
                  onClick={() => {
                    setDeleteDialogVisible(true);
                  }}
                >
                  <Delete />
                </IconButton>
              </AuthorizedContent>
            </Grid>
          </Grid>

          <Box marginTop="20px" marginBottom="50px">
            <Tabs value={1}>
              <Tab label="Product description" value={1} />
            </Tabs>
            <Box
              dangerouslySetInnerHTML={{ __html: data.description }}
              className={styles.productDesc}
              padding="1%"
              sx={{
                wordWrap: "break-word",
              }}
            />
          </Box>

          <Dialog
            open={deleteDialogVisible}
            onClose={() => {
              setDeleteDialogVisible(false);
            }}
          >
            <DialogTitle>Confirm deletion</DialogTitle>
            <DialogContent>
              Do you really want to delete this product?
            </DialogContent>
            <DialogActions>
              <Button
                variant="outlined"
                color="error"
                onClick={handleDeleteProduct}
              >
                Delete
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  setDeleteDialogVisible(false);
                }}
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      )}
    </Box>
  );
}
