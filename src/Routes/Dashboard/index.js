import { ManageAccounts, ShoppingCart } from "@mui/icons-material";
import { AspectRatio } from "@mui/joy";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  CssBaseline,
  Dialog,
  Divider,
  Grid,
  MenuItem,
  Select,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AuthorizedContent from "../../Component/Auth/authorizedContent";
import { api_endpoint } from "../../config";

export default function Dashboard() {
  const { role } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState(0);

  return !role.includes("staff") && !role.includes("admin") ? (
    <Typography variant="h5">You are not allowed to view this page!</Typography>
  ) : (
    <Box minHeight="100vh">
      <CssBaseline />
      <Grid container>
        <Grid item lg={2}>
          <Tabs
            orientation="vertical"
            variant="standard"
            value={activeTab}
            onChange={(evt, value) => {
              setActiveTab(value);
            }}
            aria-label="Vertical tabs example"
            sx={{
              borderRight: 1,
              borderColor: "divider",
              height: "100%",
              overflow: "hidden",
            }}
          >
            <Tab
              label={
                <>
                  <ShoppingCart />
                  <Box>Orders</Box>
                </>
              }
              value={0}
            />
            <AuthorizedContent requiredRole="admin">
              <Tab
                label={
                  <>
                    <ManageAccounts />
                    <Box>User</Box>
                  </>
                }
                value={1}
              />
            </AuthorizedContent>
          </Tabs>
        </Grid>
        <Grid item lg={10}>
          <Container>
            <OrdersManager />
          </Container>
        </Grid>
      </Grid>
    </Box>
  );
}

function OrdersManager() {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [orderDetail, setOrderDetail] = useState({
    user: { email: "" },
    items: [],
    totalBill: 0,
    shippingAddress: { firstName: "", lastName: "" },
    status: "",
  });
  const [orderDetailVisible, setOrderDetailVisible] = useState(false);

  const statusOption = [
    "Pending",
    "In progress",
    "Completed",
    "Returned",
    "Canceled",
  ];

  const col = [
    { field: "email", headerName: "Email", width: 250 },
    { field: "date", headerName: "Date", width: 250 },
    { field: "totalBill", headerName: "Total", width: 200 },
    { field: "paymentMethod", headerName: "Payment", width: 200 },
    { field: "status", headerName: "Status", width: 200 },
  ];

  const fetchAllOrders = () => {
    setLoading(true);
    axios
      .get(`${api_endpoint}/dashboard/order`, { withCredentials: true })
      .then((res) => {
        setOrders([...res.data]);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleOpenOrderDetail = (orderId) => {
    axios
      .get(`${api_endpoint}/dashboard/order/${orderId}`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.status === 200) {
          setOrderDetail({ ...res.data });
          setOrderDetailVisible(true);
        }
      })
      .catch((err) => {
        console.log(err);
        return;
      });
  };
  const handleCloseOrderDetail = () => {
    setOrderDetailVisible(false);
  };

  const handleUpdatingOrder = (evt) => {
    evt.preventDefault();

    axios
      .put(
        `${api_endpoint}/dashboard/order/${orderDetail._id}`,
        { status: orderDetail.status },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setOrderDetail({ ...res.data });
          fetchAllOrders();
        }
      })
      .catch((err) => {
        console.log(err);
        return;
      });
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <>
      <Typography variant="h5" marginTop="15px" marginBottom="15px">
        Customers order
      </Typography>
      {loading ? (
        <Box justifyContent="center" display="flex">
          <CircularProgress />
        </Box>
      ) : (
        <DataGrid
          autoHeight
          rows={orders.map((item) => ({
            ...item,
            date: new Date(item.date).toLocaleString(),
            totalBill: "$" + item.totalBill,
            email: item.user.email,
          }))}
          rowHeight={50}
          columns={col}
          sx={{ marginTop: "20px", marginBottom: "40px" }}
          getRowId={(row) => row._id}
          rowSelection={false}
          onRowClick={(row) => {
            handleOpenOrderDetail(row.id);
          }}
        />
      )}
      <Dialog open={orderDetailVisible} onClose={handleCloseOrderDetail}>
        <Box padding="4%">
          <Typography variant="h6" marginBottom="15px">
            Order of: {orderDetail.user.email}
          </Typography>
          <Box>
            {orderDetail.items.map((item, index) => {
              return (
                <Box key={index} marginBottom="10px">
                  <Grid container marginBottom="5px">
                    <Grid item lg={2} borderRadius="4px" overflow="hidden">
                      <AspectRatio ratio="1/1">
                        <img
                          alt=""
                          src={item.product.thumbnailUrl}
                          width="100%"
                        />
                      </AspectRatio>
                    </Grid>
                    <Grid item lg={0.5} />
                    <Grid item lg={8}>
                      <Typography
                        variant="body1"
                        whiteSpace="nowrap"
                        overflow="hidden"
                        textOverflow="ellipsis"
                      >
                        {item.product.name}
                      </Typography>
                      <Typography variant="subtitle2" color="GrayText">
                        ${item.product.price}
                      </Typography>
                    </Grid>
                    <Grid item lg={0.5} />
                    <Grid item lg={1}>
                      x{item.quantity}
                    </Grid>
                  </Grid>
                  <Divider />
                </Box>
              );
            })}
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h5">Total:</Typography>
            <Typography variant="h5">
              ${orderDetail.totalBill.toFixed(2)}
            </Typography>
          </Box>
          <Grid container marginTop="15px">
            <Grid item lg={7}>
              <Typography variant="h6">Shipping</Typography>
              <Typography variant="body2">
                {orderDetail.shippingAddress.firstName +
                  " " +
                  orderDetail.shippingAddress.lastName}
              </Typography>
              <Typography variant="body2">
                {orderDetail.shippingAddress.phone}
              </Typography>
              <Typography variant="body2">
                {orderDetail.shippingAddress.detailedAddress +
                  ", " +
                  orderDetail.shippingAddress.city}
              </Typography>
            </Grid>
            <Grid item lg={5}>
              <Typography variant="h6">Payment</Typography>
              <Typography variant="body2">
                {orderDetail.paymentMethod}
              </Typography>
            </Grid>
          </Grid>
          <Grid
            container
            component="form"
            spacing={2}
            alignItems="center"
            onSubmit={handleUpdatingOrder}
          >
            <Grid item lg={8}>
              <Select
                value={orderDetail.status}
                fullWidth
                variant="outlined"
                sx={{ marginTop: "10px" }}
                onChange={(evt) => {
                  setOrderDetail({ ...orderDetail, status: evt.target.value });
                }}
              >
                {statusOption.map((item, index) => {
                  return (
                    <MenuItem value={item} key={index}>
                      {item}
                    </MenuItem>
                  );
                })}
              </Select>
            </Grid>
            <Grid item lg={4}>
              <Button type="submit" variant="contained" fullWidth>
                Save
              </Button>
            </Grid>
          </Grid>
          <Grid item lg={12} marginTop="20px">
            <Button
              fullWidth
              variant="outlined"
              onClick={handleCloseOrderDetail}
            >
              Close
            </Button>
          </Grid>
        </Box>
      </Dialog>
    </>
  );
}
