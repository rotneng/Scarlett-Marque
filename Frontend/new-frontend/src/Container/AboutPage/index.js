import { useNavigate } from "react-router-dom";
import { Box, Typography, Grid, Button } from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SecurityIcon from "@mui/icons-material/Security";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import FacebookIcon from "@mui/icons-material/Facebook";
import EmailIcon from "@mui/icons-material/Email";

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Box
        sx={{
          py: { xs: 2, md: 3 },
          backgroundColor: "#0f2a1d",
          color: "white",
          boxShadow: 3,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ fontSize: { xs: "1.5rem", md: "2.125rem" } }}
        >
          About Scarlett Marque
        </Typography>
      </Box>

      <Box sx={{ p: { xs: 2, md: 4 }, textAlign: "center" }}>
        <Box
          component="img"
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
          alt="About"
          sx={{
            width: { xs: "100%", md: "50%" },
            height: { xs: "auto", md: "400px" },
            objectFit: "cover",
            borderRadius: "15px",
            boxShadow: 3,
          }}
        ></Box>
      </Box>

      <Box sx={{ py: { xs: 4, md: 6 }, px: 2, backgroundColor: "#f9f9f9" }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          color="#0f2a1d"
          sx={{
            mb: { xs: 3, md: 5 },
            fontSize: { xs: "1.75rem", md: "2.125rem" },
          }}
        >
          Why Shop With Us?
        </Typography>

        <Grid container spacing={{ xs: 4, md: 4 }} justifyContent="center">
          <Grid item xs={12} md={4} textAlign="center">
            <Box sx={{ color: "#0f2a1d", p: 2 }}>
              <LocalShippingIcon sx={{ fontSize: { xs: 50, md: 60 }, mb: 2 }} />
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
              <SecurityIcon sx={{ fontSize: { xs: 50, md: 60 }, mb: 2 }} />
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
              <SupportAgentIcon sx={{ fontSize: { xs: 50, md: 60 }, mb: 2 }} />
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

      <Box sx={{ py: { xs: 6, md: 8 }, textAlign: "center", px: 2 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ mb: 3, fontSize: { xs: "1.5rem", md: "2.125rem" } }}
        >
          Ready to find something special?
        </Typography>

        <Button
          variant="contained"
          size="large"
          sx={{
            backgroundColor: "#0f2a1d",
            color: "white",
            borderRadius: "30px",
            px: { xs: 3, md: 5 },
            py: 1.5,
            fontSize: { xs: "1rem", md: "1.1rem" },
            "&:hover": { backgroundColor: "#1a4d33" },
            width: { xs: "100%", sm: "auto" },
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
          px: 2,
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
        >
          Get Connected with us on Social Networks
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: { xs: 2, md: 3 },
            mt: 2,
            flexWrap: "wrap",
          }}
        >
          <a
            href="https://www.instagram.com/_thescarlettmarque/?__pwa=1"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            <InstagramIcon
              sx={{
                fontSize: { xs: 25, md: 30 },
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
                fontSize: { xs: 25, md: 30 },
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
                fontSize: { xs: 25, md: 30 },
                cursor: "pointer",
                "&:hover": { color: "#4267B2" },
              }}
            />
          </a>

          <a
            href="https://mail.google.com/mail/u/0/?tab=rm&ogbl#inbox?compose=CllgCJTHWDGRHrxwfxZtRRzCgjmZSFcTrRLdfWGRlJmLvHKsGsvwnSvRJZcKFSzVNrcbSvBCgZg"
            target="blank"
            rel="noopener noreferrer"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            <EmailIcon
              sx={{
                fontSize: { xs: 25, md: 30 },
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
