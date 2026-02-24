import { Routes, Route, useLocation } from "react-router";
import "./App.css";
import LoginandSignup from "./pages/LoginandSignup";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Footer from "./components/Footer";
import ProductView from "./pages/ProductView";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Profile from "./pages/Profile";
import ProtectedRoute from "./router/ProtectedRoute";
import CheckoutPage from "./pages/CheckoutPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import OrdersPage from "./pages/OrdersPage";
import LoadingScreen from "./pages/LoadingScreen";

function App() {
  const location = useLocation();
  const isSignupPage = location.pathname === "/signup";

  return (
    <>
      <div className="flex flex-col min-h-screen">
        {!isSignupPage && <LoadingScreen />}
        {!isSignupPage && <Navbar />}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route path="/Product/:id" element={<ProductView />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/signup" element={<LoginandSignup />} />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order/:id"
              element={
                <ProtectedRoute>
                  <OrderDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        {!isSignupPage && <Footer />}
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </>
  );
}

export default App;
