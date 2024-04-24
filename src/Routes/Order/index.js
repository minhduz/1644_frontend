import {
  Box,
  Button,
  Container,
  CssBaseline,
  Dialog,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { api_endpoint } from "../../config";
import { DataGrid } from "@mui/x-data-grid";
import { AspectRatio } from "@mui/joy";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [orderDetail, setOrderDetail] = useState({
    items: [],
    totalBill: 0,
    shippingAddress: { firstName: "", lastName: "" },
    status: "",
  });
  const [orderDetailVisible, setOrderDetailVisible] = useState(false);

  const col = [
    { field: "date", headerName: "Date", width: 250 },
    { field: "totalBill", headerName: "Total", width: 250 },
    { field: "paymentMethod", headerName: "Payment", width: 250 },
    { field: "status", headerName: "Status", width: 250 },
  ];

  const handleOpenOrderDetail = (orderId) => {
    axios
      .get(`${api_endpoint}/order/${orderId}`, { withCredentials: true })
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

  useEffect(() => {
    window.scroll(0, 0);
    axios
      .get(`${api_endpoint}/order`, { withCredentials: true })
      .then((res) => {
        if (res.status === 200) {
          setOrders([...res.data]);
        }
        return;
      })
      .catch((err) => {
        console.log(err);
        return;
      });
  }, []);

  return (
    <>
      <Container sx={{ minHeight: "100vh" }}>
        <CssBaseline />
        <Typography variant="h5" marginTop="20px" marginBottom="20px">
          Your orders
        </Typography>
        <Divider />
        <DataGrid
          autoHeight
          rows={orders.map((item) => ({
            ...item,
            date: new Date(item.date).toLocaleString(),
            totalBill: "$" + item.totalBill,
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
      </Container>
      <Dialog open={orderDetailVisible} onClose={handleCloseOrderDetail}>
        <CssBaseline />
        <Box padding="4%">
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
