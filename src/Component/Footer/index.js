import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Grid } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
        backgroundColor: "#F8F9FA",
      }}
    >
      <Container>
        <Grid container spacing={2}>
          <Grid item lg={4}></Grid>
          <Grid item lg={4} textAlign="center">
            <Typography variant="body1"></Typography>
          </Grid>
          <Grid item lg={4}>
            Nguyen Minh Duc - GCH210774
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
