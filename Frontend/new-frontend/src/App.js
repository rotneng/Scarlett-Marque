import logo from "./logo.svg";
import "./App.css";
import Homepage from "./Container/Homepage";
import SignUp from "./Container/SignUp";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import AddProducts from "./Container/Products/addProducts";
import SignIn from "./Container/SignIn";
import ProductDetails from "./Container/ProductID";
import CartPage from "./Container/CartPage";
import UpdateProduct from "./Container/Products/updateProducts";
import PrivateRoute from "./Container/PrivateRoute/PrivateRoute";
import AboutPage from "./Container/AboutPage";
import CheckoutPage from "./Container/Checkout";
import AddressPage from "./Container/AddressPage";
import PaymentPage from "./Container/PaymentPage";


function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/signIn" element={<SignIn />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/about" element={<AboutPage />} />

          <Route element={<PrivateRoute />}>
            <Route path="/product/edit/:id" element={<UpdateProduct />} />
            <Route path="/addproducts" element={<AddProducts />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/address" element={<AddressPage/>} />
            <Route path="/payment" element={<PaymentPage/>} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
