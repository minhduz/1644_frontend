import { AspectRatio } from "@mui/joy";
import {
  Button,
  Container,
  CssBaseline,
  Divider,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import _ from "underscore";
import AuthorizedPage from "../../Component/Auth/authorizedPage";
import { getCurrentUser } from "../../Component/User";
import { api_endpoint } from "../../config";

export default function Checkout() {
  const navigate = useNavigate();
  const { shippingAddress } = useSelector((state) => state.user);
  const { items, count } = useSelector((state) => state.cart);
  const [orderData, setOrderData] = useState({
    shippingAddress: {},
    paymentMethod: "",
  });
  const paymentMethods = [
    {
      name: "Cash on Delivery",
      description: "Pays at the time of delivery",
      value: "COD",
    },
    {
      name: "Bank transfer (FREE SHIPPING)",
      description: "We will call you later to process",
      value: "Bank transfer",
    },
  ];

  const steps = [
    { name: "Shipping address", component: <AddressForm /> },
    { name: "Select payment method", component: <PaymentMethod /> },
    { name: "Review your order", component: <ReviewOrder /> },
  ];
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleCreateOrder = () => {
    axios
      .post(
        `${api_endpoint}/order`,
        { ...orderData },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          getCurrentUser();
          handleNext();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function AddressForm() {
    const [formData, setFormData] = useState({ ...shippingAddress });

    const handleSubmitForm = (evt) => {
      evt.preventDefault();
      setOrderData({ ...orderData, shippingAddress: { ...formData } });
      handleNext();
    };

    return (
      <Box component="form" onSubmit={handleSubmitForm}>
        <Typography variant="h6" gutterBottom>
          Shipping address
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              type="text"
              required
              label="First name"
              fullWidth
              variant="standard"
              value={formData.firstName}
              onChange={(evt) => {
                setFormData({ ...formData, firstName: evt.target.value });
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type="text"
              required
              label="Last name"
              fullWidth
              variant="standard"
              value={formData.lastName}
              onChange={(evt) => {
                setFormData({ ...formData, lastName: evt.target.value });
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="text"
              required
              label="Phone number"
              fullWidth
              variant="standard"
              value={formData.phone}
              onChange={(evt) => {
                setFormData({ ...formData, phone: evt.target.value });
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="text"
              required
              label="Address"
              fullWidth
              variant="standard"
              value={formData.detailedAddress}
              onChange={(evt) => {
                setFormData({ ...formData, detailedAddress: evt.target.value });
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type="text"
              required
              label="City"
              fullWidth
              variant="standard"
              value={formData.city}
              onChange={(evt) => {
                setFormData({ ...formData, city: evt.target.value });
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type="text"
              label="State/Province"
              fullWidth
              variant="standard"
              value={formData.state}
              onChange={(evt) => {
                setFormData({ ...formData, state: evt.target.value });
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type="text"
              required
              label="Zip / Postal code"
              fullWidth
              variant="standard"
              value={formData.postalCode}
              onChange={(evt) => {
                setFormData({ ...formData, postalCode: evt.target.value });
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type="text"
              required
              label="Country"
              fullWidth
              variant="standard"
              value={formData.country}
              onChange={(evt) => {
                setFormData({ ...formData, country: evt.target.value });
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" fullWidth type="submit">
              Next
            </Button>
          </Grid>
        </Grid>
      </Box>
    );
  }

  function PaymentMethod() {
    const handleSubmit = (evt) => {
      evt.preventDefault();
      setOrderData({ ...orderData, paymentMethod: evt.target.method.value });
      handleNext();
    };
    return (
      <Box
        component="form"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        onSubmit={handleSubmit}
      >
        <Typography variant="h6" marginBottom="10px">
          Payment method
        </Typography>
        <RadioGroup name="method">
          {paymentMethods.map((item, index) => {
            return (
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                key={index}
                marginBottom="15px"
              >
                <Radio value={item.value} required />
                <Box>
                  <Typography variant="body1">{item.name}</Typography>
                  <Typography variant="caption" color="GrayText">
                    {item.description}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </RadioGroup>
        <Box display="flex" justifyContent="space-between">
          <Button onClick={handleBack} variant="outlined">
            Back
          </Button>
          <Button type="submit" variant="contained">
            Next
          </Button>
        </Box>
      </Box>
    );
  }

  function ReviewOrder() {
    let total = 0;
    return (
      <Box>
        <Box>
          {items.map((item, index) => {
            total += item.product.price * item.quantity;

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
          <Typography variant="h5">${total.toFixed(2)}</Typography>
        </Box>

        <Grid container marginTop="15px">
          <Grid item lg={7}>
            <Typography variant="h6">Shipping</Typography>
            <Typography variant="body2">
              {orderData.shippingAddress.firstName +
                " " +
                orderData.shippingAddress.lastName}
            </Typography>
            <Typography variant="body2">
              {orderData.shippingAddress.phone}
            </Typography>
            <Typography variant="body2">
              {orderData.shippingAddress.detailedAddress +
                ", " +
                orderData.shippingAddress.city}
            </Typography>
          </Grid>
          <Grid item lg={5}>
            <Typography variant="h6">Payment</Typography>
            <Typography variant="body2">{orderData.paymentMethod}</Typography>
          </Grid>
        </Grid>

        <Grid container marginTop="20px">
          <Grid item lg={2}>
            <Button fullWidth variant="outlined" onClick={handleBack}>
              Back
            </Button>
          </Grid>
          <Grid item lg={5} />
          <Grid item lg={5}>
            <Button fullWidth variant="contained" onClick={handleCreateOrder}>
              Place order
            </Button>
          </Grid>
        </Grid>
      </Box>
    );
  }

  useEffect(() => {
    window.scroll(0, 0);
  }, [activeStep]);

  return (
    <AuthorizedPage>
      <Container component="main" maxWidth="sm" sx={{ minHeight: "100vh" }}>
        <CssBaseline />
        <Paper
          variant="outlined"
          sx={{
            my: { xs: 3, md: 6 },
            p: { xs: 2, md: 3 },
            borderRadius: "6px",
          }}
        >
          <Typography component="h1" variant="h4" align="center">
            Checkout
          </Typography>
          <Stepper
            alternativeLabel
            activeStep={activeStep}
            sx={{ pt: 3, pb: 5 }}
          >
            {steps.map((step) => (
              <Step key={step.name}>
                <StepLabel>{step.name}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? (
            <>
              <Typography variant="h5" gutterBottom textAlign="center">
                Your order has been placed, thank you for using our service!
              </Typography>
              <Grid container spacing={2}>
                <Grid item lg={5}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => {
                      navigate("/orders");
                    }}
                  >
                    Your orders
                  </Button>
                </Grid>
                <Grid item lg={7}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => {
                      navigate("/product");
                    }}
                  >
                    Continue shopping
                  </Button>
                </Grid>
              </Grid>
            </>
          ) : (
            <>{steps[activeStep].component}</>
          )}
        </Paper>
      </Container>
    </AuthorizedPage>
  );
}
