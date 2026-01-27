// import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { useNavigate, useLocation } from "react-router-dom";
// import {
//   Box,
//   Typography,
//   Button,
//   Grid,
//   Card,
//   CardContent,
//   Divider,
//   Radio,
//   RadioGroup,
//   Container,
//   Stack,
//   Paper,
//   alpha,
// } from "@mui/material";

// import CreditCardIcon from "@mui/icons-material/CreditCard";
// import LocalShippingIcon from "@mui/icons-material/LocalShippingOutlined";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import LockIcon from "@mui/icons-material/Lock";
// import PersonPinCircleIcon from "@mui/icons-material/PersonPinCircleOutlined";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// const PaymentPage = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const {
//     shippingAddress,
//     selectedAddress: oldAddressName,
//     totalPrice,
//     total: oldTotalName,
//     itemsPrice,
//     cartItems: stateCartItems,
//   } = location.state || {};

//   const address = shippingAddress || oldAddressName;
//   const finalTotal = totalPrice || oldTotalName;

//   const { cartItems: reduxCartItems } = useSelector((state) => state.cart);
//   const finalCartItems = stateCartItems || reduxCartItems;

//   const [paymentMethod, setPaymentMethod] = useState("Card");

//   useEffect(() => {
//     if (!address || !finalCartItems || finalCartItems.length === 0) {
//       navigate("/cart");
//     }
//   }, [address, finalCartItems, navigate]);

//   const handleContinue = () => {
//     if (!address) {
//       alert("Address is missing. Please go back and select an address.");
//       return;
//     }
//     navigate("/place-order", {
//       state: {
//         shippingAddress: address,
//         paymentMethod,
//         totalPrice: finalTotal,
//         itemsPrice: itemsPrice,
//         cartItems: finalCartItems,
//       },
//     });
//   };

//   if (!address) return null;

//   const PaymentOption = ({ value, icon, title, subtitle }) => {
//     const isSelected = paymentMethod === value;
//     return (
//       <Paper
//         elevation={0}
//         onClick={() => setPaymentMethod(value)}
//         sx={{
//           position: "relative",
//           p: 3,
//           mb: 2,
//           cursor: "pointer",
//           borderRadius: "16px",
//           border: "2px solid",
//           borderColor: isSelected ? "#0f2a1d" : "#e0e0e0",
//           backgroundColor: isSelected ? alpha("#0f2a1d", 0.04) : "#fff",
//           transition: "all 0.2s ease",
//           "&:hover": {
//             borderColor: isSelected ? "#0f2a1d" : "#bbb",
//             boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
//           },
//         }}
//       >
//         <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
//           <Radio
//             checked={isSelected}
//             value={value}
//             sx={{
//               color: "#0f2a1d",
//               "&.Mui-checked": { color: "#0f2a1d" },
//               mr: 2,
//             }}
//           />
//           <Box
//             sx={{
//               p: 1.5,
//               borderRadius: "50%",
//               bgcolor: isSelected ? "#0f2a1d" : "#f5f5f5",
//               color: isSelected ? "white" : "#666",
//               display: "flex",
//               mr: 2,
//             }}
//           >
//             {icon}
//           </Box>
//           <Box>
//             <Typography
//               variant="h6"
//               fontWeight="bold"
//               color={isSelected ? "#0f2a1d" : "text.primary"}
//             >
//               {title}
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               {subtitle}
//             </Typography>
//           </Box>

//           {isSelected && (
//             <CheckCircleIcon
//               sx={{
//                 position: "absolute",
//                 top: 16,
//                 right: 16,
//                 color: "#0f2a1d",
//               }}
//             />
//           )}
//         </Box>
//       </Paper>
//     );
//   };

//   return (
//     <Box sx={{ backgroundColor: "#f8f9fa", minHeight: "100vh", py: 4 }}>
//       <Container maxWidth="lg">
//         <Box sx={{ mb: 4 }}>
//           <Button
//             startIcon={<ArrowBackIcon />}
//             onClick={() => navigate("/checkout")}
//             sx={{
//               mb: 2,
//               color: "#666",
//               textTransform: "none",
//               fontWeight: 600,
//               "&:hover": { color: "#0f2a1d", bgcolor: "transparent" },
//             }}
//           >
//             Back to Address
//           </Button>
//           <Typography variant="h4" fontWeight="800" color="#0f2a1d">
//             Payment Method
//           </Typography>
//           <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
//             Choose how you would like to pay for your order.
//           </Typography>
//         </Box>

//         <Grid container spacing={4}>
//           <Grid item xs={12} md={8}>
//             <RadioGroup
//               value={paymentMethod}
//               onChange={(e) => setPaymentMethod(e.target.value)}
//             >
//               <PaymentOption
//                 value="Card"
//                 icon={<CreditCardIcon />}
//                 title="Pay with Card"
//                 subtitle="Secured by Paystack. Supports Visa, Mastercard & Verve."
//               />

//               <PaymentOption
//                 value="Pay On Delivery"
//                 icon={<LocalShippingIcon />}
//                 title="Pay on Delivery"
//                 subtitle="Pay via cash or transfer when your order arrives."
//               />
//             </RadioGroup>
//           </Grid>

//           <Grid item xs={12} md={4}>
//             <Card
//               elevation={0}
//               sx={{
//                 borderRadius: "16px",
//                 border: "1px solid #e0e0e0",
//                 position: "sticky",
//                 top: 24,
//                 overflow: "hidden",
//               }}
//             >
//               <Box
//                 sx={{
//                   p: 3,
//                   bgcolor: "#fcfcfc",
//                   borderBottom: "1px solid #eee",
//                 }}
//               >
//                 <Typography variant="h6" fontWeight="bold" color="#0f2a1d">
//                   Order Summary
//                 </Typography>
//               </Box>

//               <CardContent sx={{ p: 3 }}>
//                 <Box sx={{ display: "flex", mb: 3 }}>
//                   <PersonPinCircleIcon
//                     sx={{ color: "#0f2a1d", mr: 1, mt: 0.5 }}
//                     fontSize="small"
//                   />
//                   <Box>
//                     <Typography variant="subtitle2" color="text.secondary">
//                       Ship to:
//                     </Typography>
//                     <Typography
//                       variant="body2"
//                       fontWeight="600"
//                       sx={{ lineHeight: 1.4 }}
//                     >
//                       {address.fullName}
//                     </Typography>
//                     <Typography variant="caption" color="text.secondary">
//                       {address.address}, {address.city}
//                     </Typography>
//                   </Box>
//                 </Box>

//                 <Divider sx={{ mb: 3 }} />

//                 <Stack spacing={1.5} sx={{ mb: 3 }}>
//                   <Box
//                     sx={{ display: "flex", justifyContent: "space-between" }}
//                   >
//                     <Typography color="text.secondary">
//                       Items ({finalCartItems?.length})
//                     </Typography>
//                     <Typography fontWeight="500">
//                       ₦{finalTotal?.toLocaleString()}
//                     </Typography>
//                   </Box>
//                   <Box
//                     sx={{ display: "flex", justifyContent: "space-between" }}
//                   >
//                     <Typography color="text.secondary">Delivery Fee</Typography>
//                     <Typography fontWeight="bold" color="success.main">
//                       Free
//                     </Typography>
//                   </Box>
//                 </Stack>

//                 <Divider sx={{ mb: 3 }} />

//                 <Box
//                   sx={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                     mb: 4,
//                   }}
//                 >
//                   <Typography variant="h6" fontWeight="bold">
//                     Total
//                   </Typography>
//                   <Typography variant="h5" fontWeight="bold" color="#0f2a1d">
//                     ₦{finalTotal?.toLocaleString()}
//                   </Typography>
//                 </Box>

//                 <Button
//                   fullWidth
//                   variant="contained"
//                   onClick={handleContinue}
//                   sx={{
//                     bgcolor: "#0f2a1d",
//                     py: 1.8,
//                     borderRadius: "50px",
//                     fontSize: "1rem",
//                     fontWeight: "bold",
//                     textTransform: "none",
//                     boxShadow: "0 8px 16px rgba(15, 42, 29, 0.2)",
//                     "&:hover": {
//                       bgcolor: "#144430",
//                       boxShadow: "0 10px 20px rgba(15, 42, 29, 0.3)",
//                     },
//                   }}
//                 >
//                   Continue
//                 </Button>

//                 <Box
//                   sx={{
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center",
//                     mt: 3,
//                     opacity: 0.7,
//                   }}
//                 >
//                   <LockIcon sx={{ fontSize: 14, mr: 0.5, color: "#555" }} />
//                   <Typography variant="caption" color="text.secondary">
//                     Secure Encrypted Checkout
//                   </Typography>
//                 </Box>
//               </CardContent>
//             </Card>
//           </Grid>
//         </Grid>
//       </Container>
//     </Box>
//   );
// };

// export default PaymentPage;
