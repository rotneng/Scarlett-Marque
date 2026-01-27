import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Button,
  Container,
  Paper,
  Avatar,
  Stack,
  Divider,
} from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShippingOutlined";
import SecurityIcon from "@mui/icons-material/SecurityOutlined";
import SupportAgentIcon from "@mui/icons-material/SupportAgentOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import FacebookIcon from "@mui/icons-material/Facebook";
import EmailIcon from "@mui/icons-material/EmailOutlined";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import Header from "../header";

const AboutPage = () => {
  const navigate = useNavigate();

  const themeColor = "#0f2a1d";
  const accentColor = "#e8f5e9";
  const lightText = "#666";

  const features = [
    {
      icon: <LocalShippingIcon fontSize="large" />,
      title: "Fast Delivery",
      desc: "We ensure your products arrive on time, every time.",
    },
    {
      icon: <SecurityIcon fontSize="large" />,
      title: "Secure Payments",
      desc: "Top-tier encryption to ensure your data is always safe.",
    },
    {
      icon: <SupportAgentIcon fontSize="large" />,
      title: "24/7 Support",
      desc: "Our friendly support team is here around the clock.",
    },
  ];

  const socialLinks = [
    {
      icon: <InstagramIcon />,
      url: "https://www.instagram.com/_thescarlettmarque/?__pwa=1",
      color: "#E1306C",
    },
    {
      icon: <WhatsAppIcon />,
      url: "https://wa.me/message/BDZOAQ55PD3TB1",
      color: "#25D366",
    },
    {
      icon: <FacebookIcon />,
      url: "https://web.facebook.com/people/The-Scarlett-Marque/100093208170923/",
      color: "#4267B2",
    },
    {
      icon: <EmailIcon />,
      url: "mailto:contact@scarlettmarque.com",
      color: "#DB4437",
    },
  ];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fff" }}>
      <Header />

      <Box
        sx={{
          bgcolor: themeColor,
          color: "white",
          pt: { xs: 8, md: 12 },
          pb: { xs: 12, md: 20 },
          textAlign: "center",
          position: "relative",
          clipPath: "polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="overline"
            sx={{ letterSpacing: 3, opacity: 0.8, fontSize: "0.9rem" }}
          >
            WELCOME TO
          </Typography>
          <Typography
            variant="h2"
            fontWeight="900"
            sx={{
              mt: 1,
              mb: 3,
              fontSize: { xs: "2.5rem", md: "4rem" },
              textTransform: "uppercase",
              letterSpacing: -1,
            }}
          >
            Scarlett Marque
          </Typography>
          <Typography
            variant="h6"
            sx={{
              maxWidth: "600px",
              mx: "auto",
              opacity: 0.9,
              fontWeight: 300,
              lineHeight: 1.6,
              mb: 4,
            }}
          >
            Defining style and elegance. We are dedicated to providing premium
            products with an experience that revolves around you.
          </Typography>

          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate("/")}
            sx={{
              color: "white",
              borderColor: "rgba(255,255,255,0.5)",
              borderRadius: "30px",
              px: 4,
              py: 1,
              "&:hover": {
                borderColor: "white",
                bgcolor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            Explore Collection
          </Button>
        </Container>
      </Box>

      <Container
        maxWidth="lg"
        sx={{ mt: { xs: -8, md: -14 }, mb: 8, position: "relative", zIndex: 2 }}
      >
        <Box
          component="img"
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
          alt="About Us"
          sx={{
            width: "100%",
            height: { xs: "250px", md: "450px" },
            objectFit: "cover",
            borderRadius: "24px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            display: "block",
            mx: "auto",
          }}
        />
      </Container>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box textAlign="center" mb={6}>
          <Typography
            variant="h4"
            fontWeight="bold"
            color={themeColor}
            gutterBottom
          >
            Why Shop With Us?
          </Typography>
          <Box
            sx={{
              width: 60,
              height: 4,
              bgcolor: themeColor,
              mx: "auto",
              borderRadius: 2,
            }}
          />
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {features.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  textAlign: "center",
                  height: "100%",
                  bgcolor: "#fafafa",
                  borderRadius: "20px",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    bgcolor: accentColor,
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 70,
                    height: 70,
                    bgcolor: "white",
                    color: themeColor,
                    mx: "auto",
                    mb: 2,
                    boxShadow: 2,
                  }}
                >
                  {item.icon}
                </Avatar>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  gutterBottom
                  color={themeColor}
                >
                  {item.title}
                </Typography>
                <Typography
                  variant="body2"
                  color={lightText}
                  sx={{ lineHeight: 1.6 }}
                >
                  {item.desc}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box
        component="footer"
        sx={{
          bgcolor: "#fafafa",
          pt: 8,
          pb: 6,
          borderTop: "1px solid #eee",
          mt: 4,
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ color: themeColor, mb: 2 }}
          >
            Connect With Us
          </Typography>
          <Stack
            direction="row"
            spacing={{ xs: 2, md: 3 }}
            justifyContent="center"
            alignItems="center"
            sx={{ mb: 5 }}
          >
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: "50%",
                    bgcolor: "white",
                    color: "#555",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease",
                    display: "flex",
                    "&:hover": {
                      bgcolor: social.color,
                      color: "white",
                      transform: "translateY(-3px)",
                    },
                  }}
                >
                  {social.icon}
                </Box>
              </a>
            ))}
          </Stack>

          <Divider sx={{ mb: 5, opacity: 0.6 }} />

          <Grid
            container
            spacing={4}
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={12} md={6}>
              <Stack
                direction="column"
                alignItems="center"
                spacing={1}
                sx={{ color: themeColor }}
              >
                <LocationOnIcon fontSize="large" sx={{ mb: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  Visit Our Store
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ lineHeight: 1.6, maxWidth: "300px" }}
                >
                  Longwa Phase 3, before Solomon Lar Amusement Park,
                  <br />
                  House 11, Shop No 3, Jos, Nigeria
                </Typography>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack direction="column" alignItems="center" spacing={1}>
                <Typography variant="body1" color="text.secondary">
                  Ready to experience quality?
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate("/")}
                  sx={{
                    bgcolor: themeColor,
                    px: 4,
                    borderRadius: "20px",
                    textTransform: "none",
                    "&:hover": { bgcolor: "#0a1f15" },
                  }}
                >
                  Go to Shop
                </Button>
              </Stack>
            </Grid>
          </Grid>

          <Box sx={{ mt: 8 }}>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} Scarlett Marque. All rights reserved.
            </Typography>
            <Typography
              variant="caption"
              display="block"
              sx={{ mt: 1, color: "#aaa", fontStyle: "italic" }}
            >
              Developed by Rotnen
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default AboutPage;
