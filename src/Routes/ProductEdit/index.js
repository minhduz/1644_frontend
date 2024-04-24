import "./styles.css";
import axios from "axios";
import { useEffect, useState } from "react";

import ReactQuill from "react-quill";
import { UUID } from "uuidjs";
import { api_endpoint } from "../../config";
import { uploadFileToFirebase } from "../../Firebase";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  IconButton,
  LinearProgress,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { AspectRatio } from "@mui/joy";
import { CloseOutlined } from "@mui/icons-material";

export default function EditProduct() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState({
    name: "",
    price: 0,
    stock: 0,
    description: "",
    thumbnailUrl: "https://via.placeholder.com/500?text=Placeholder",
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);

  const handleAddProducts = async (evt) => {
    evt.preventDefault();
    setSaving(true);

    let thumbnailUrl = null;
    if (thumbnailFile) {
      try {
        thumbnailUrl = await uploadFileToFirebase(
          `ProductThumbnails/${UUID.generate()}`,
          thumbnailFile
        );
      } catch (error) {
        console.log(error);
      }
    }

    axios
      .post(
        `${api_endpoint}/product`,
        {
          ...data,
          thumbnailUrl: thumbnailUrl ? thumbnailUrl : data.thumbnailUrl,
        },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          setSaving(false);
          setSnackbarVisible(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setSaving(false);
      });
  };

  const handleUpdateProduct = async (evt) => {
    evt.preventDefault();
    setSaving(true);

    let thumbnailUrl = null;
    if (thumbnailFile) {
      try {
        thumbnailUrl = await uploadFileToFirebase(
          `ProductThumbnails/${UUID.generate()}`,
          thumbnailFile
        );
      } catch (error) {
        console.log(error);
      }
    }

    axios
      .put(
        `${api_endpoint}/product/${productId}`,
        {
          ...data,
          thumbnailUrl: thumbnailUrl ? thumbnailUrl : data.thumbnailUrl,
        },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          setSaving(false);
          navigate(-1);
        }
      })
      .catch((err) => {
        console.log(err);
        setSaving(false);
      });
  };

  const fetchCurrentProduct = () => {
    setLoading(true);
    axios
      .get(`${api_endpoint}/product/${productId}`)
      .then((res) => {
        if (res.status === 200) {
          setData({ ...res.data });
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    window.scroll(0, 0);
    if (productId) {
      setEditMode(true);
      fetchCurrentProduct();
    }
  }, []);

  return (
    <Box minHeight="100vh">
      <CssBaseline />
      {loading ? (
        <LinearProgress />
      ) : (
        <Container sx={{ marginTop: "20px" }}>
          <Box
            component="form"
            onSubmit={editMode ? handleUpdateProduct : handleAddProducts}
          >
            <Grid container spacing={3}>
              {/* Left */}
              <Grid item lg={6}>
                <Grid item lg={12}>
                  <TextField
                    label="Product name"
                    value={data.name}
                    onChange={(evt) => {
                      setData({ ...data, name: evt.target.value });
                    }}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid container marginTop="20px" marginBottom="20px">
                  <Grid
                    item
                    lg={5}
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                  >
                    {/* Thumbnail */}
                    <Typography variant="body1">Thumbnail</Typography>
                    <input
                      type="file"
                      accept="image/*"
                      files={thumbnailFile}
                      onChange={(evt) => {
                        setThumbnailFile(evt.target.files[0]);
                      }}
                    />
                  </Grid>
                  <Grid item lg={1} />
                  <Grid
                    item
                    lg={6}
                    borderRadius="10px"
                    overflow="hidden"
                    boxShadow="rgba(0, 0, 0, 0.1) 0px 4px 12px"
                  >
                    <AspectRatio ratio="1/1">
                      <img
                        src={
                          thumbnailFile
                            ? URL.createObjectURL(thumbnailFile)
                            : data.thumbnailUrl
                        }
                        alt=""
                      />
                    </AspectRatio>
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item lg={6}>
                    <TextField
                      label="Price"
                      type="number"
                      step="0.01"
                      value={data.price}
                      onChange={(evt) => {
                        setData({ ...data, price: evt.target.value });
                      }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item lg={6}>
                    <TextField
                      label="Stock"
                      type="number"
                      value={data.stock}
                      onChange={(evt) => {
                        setData({ ...data, stock: evt.target.value });
                      }}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Grid>
              {/* Right */}
              <Grid item lg={6}>
                <ReactQuill
                  theme="snow"
                  value={data.description}
                  onChange={(value) => {
                    setData({ ...data, description: value });
                  }}
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, false] }],
                      ["bold", "italic"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["link", "image"],
                      ["clean"],
                    ],
                  }}
                />
              </Grid>
            </Grid>
            <Button variant="contained" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
            <Button
              variant="outlined"
              color="info"
              onClick={() => {
                navigate(-1);
              }}
            >
              Cancel
            </Button>
          </Box>
        </Container>
      )}
      <Snackbar
        open={snackbarVisible}
        onClose={() => {
          setSnackbarVisible(false);
        }}
        autoHideDuration={3000}
        message="Product added"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        action={
          <IconButton
            onClick={() => {
              setSnackbarVisible(false);
            }}
          >
            <CloseOutlined htmlColor="#FFFFFF" />
          </IconButton>
        }
      />
    </Box>
  );
}
