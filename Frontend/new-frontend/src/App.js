import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Box } from "@mui/material"; // Import Box for layout spacing

// Containers / Pages
import Homepage from "./Container/Homepage";
import SignUp from "./Container/SignUp";
import SignIn from "./Container/SignIn";
import ProductDetails from "./Container/ProductID";
import CartPage from "./Container/CartPage";
import AddProducts from "./Container/Products/addProducts";
import UpdateProduct from "./Container/Products/updateProducts";
import PrivateRoute from "./Container/PrivateRoute/PrivateRoute";
import AboutPage from "./Container/AboutPage";
import CheckoutPage from "./Container/Checkout";
import AddressPage from "./Container/AddressPage";
import ManageAddressPage from "./Container/ManageAddress";
import OrderPage from "./Container/OrderPage";
import PlaceOrderPage from "./Container/PlaceOrderPage";
import TrackOrderPage from "./Container/TrackOrderPage";
import AdminOrdersPage from "./Container/AdminOrderPage";
import MyOrdersPage from "./Container/MyOdersPage";
import OtpVerification from "./Container/OTPpage";
import ForgotPassword from "./Passwords/ForgotPassword";
import ResetPassword from "./Passwords/ResetPassword";
import MobileFooter from "./Container/MobileFooter"; 
import ProfilePage from "./Container/ProfilePage/ProfilePage";

function App() {
  return (
    <BrowserRouter>
      <div className="App">

        <Box sx={{ pb: { xs: "56px", md: 0 }, minHeight: "80vh" }}>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/signUp" element={<SignUp />} />
            <Route path="/signIn" element={<SignIn />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/otp-verify" element={<OtpVerification />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            <Route element={<PrivateRoute />}>
              <Route path="/product/edit/:id" element={<UpdateProduct />} />
              <Route path="/addproducts" element={<AddProducts />} />
              <Route path="/admin/orders" element={<AdminOrdersPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/address" element={<AddressPage />} />
              <Route path="/manageAddress" element={<ManageAddressPage />} />
              <Route path="/place-order" element={<PlaceOrderPage />} />
              <Route path="/order/:id" element={<OrderPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route
                path="/account/orders/track-order/:id"
                element={<TrackOrderPage />}
              />
              <Route path="/account/orders" element={<MyOrdersPage />} />
              <Route path="/track-order/:id" element={<TrackOrderPage />} />
            </Route>
          </Routes>
        </Box>

        <MobileFooter />
      </div>
    </BrowserRouter>
  );
}

export default App;