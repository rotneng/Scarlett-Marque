import { useNavigate } from "react-router-dom";
import { Box, Typography, Grid, Button } from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SecurityIcon from "@mui/icons-material/Security";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import FacebookIcon from "@mui/icons-material/Facebook";
import PhoneIcon from "@mui/icons-material/Phone";

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Box
        sx={{
          py: 3,
          backgroundColor: "#0f2a1d",
          color: "white",
          boxShadow: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          About Scarlett Marque
        </Typography>
      </Box>

      <Box sx={{ p: 4 }}>
        <Box
          component="img"
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
          alt="About"
          sx={{
            width: "50%",
            objectFit: "cover",
            borderRadius: "15px",
            boxShadow: 3,
          }}
        ></Box>
      </Box>

      <Box sx={{ py: 6, px: 2, backgroundColor: "#f9f9f9" }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          color="#0f2a1d"
          sx={{ mb: 5 }}
        >
          Why Shop With Us?
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={4} textAlign="center">
            <Box sx={{ color: "#0f2a1d", p: 2 }}>
              <LocalShippingIcon sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h6" fontWeight="bold">
                Fast Delivery
              </Typography>
              <Typography variant="body2" color="text.secondary">
                We know you want your items fast. We ensure your products arrive
                on time, every time.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4} textAlign="center">
            <Box sx={{ color: "#0f2a1d", p: 2 }}>
              <SecurityIcon sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h6" fontWeight="bold">
                Secure Payments
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your security is our priority. We use top tier encryption to
                ensure your data and money are always safe.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4} textAlign="center">
            <Box sx={{ color: "#0f2a1d", p: 2 }}>
              <SupportAgentIcon sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h6" fontWeight="bold">
                24/7 Support
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Got a question? Our friendly support team is here around the
                clock to assist you.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
          Ready to find something special?
        </Typography>

        <Button
          variant="contained"
          size="large"
          sx={{
            backgroundColor: "#0f2a1d",
            color: "white",
            borderRadius: "30px",
            px: 5,
            py: 1.5,
            fontSize: "1.1rem",
            "&:hover": { backgroundColor: "#1a4d33" },
          }}
          onClick={() => navigate("/")}
        >
          Shop Now
        </Button>
      </Box>

      <Box
        sx={{
          py: 4,
          backgroundColor: "#0f2a1d",
          color: "white",
          textAlign: "center",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Get Connected with us on Social Networks
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 3, mt: 2 }}>
          <a
            href="https://www.instagram.com/_thescarlettmarque/?__pwa=1"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            <InstagramIcon
              sx={{
                fontSize: 30,
                cursor: "pointer",
                "&:hover": { color: "#E1306C" },
              }}
            />
          </a>

          <a
            href="https://wa.me/message/BDZOAQ55PD3TB1"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            <WhatsAppIcon
              sx={{
                fontSize: 30,
                cursor: "pointer",
                "&:hover": { color: "#25D366" },
              }}
            />
          </a>

          <a
            href="https://web.facebook.com/people/The-Scarlett-Marque/100093208170923/?_rdc=1&_rdr#"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            <FacebookIcon
              sx={{
                fontSize: 30,
                cursor: "pointer",
                "&:hover": { color: "#4267B2" },
              }}
            />
          </a>
        </Box>
      </Box>
    </Box>
  );
};

export default AboutPage;