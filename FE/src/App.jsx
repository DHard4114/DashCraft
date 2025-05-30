import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Product from './pages/Product';
import BuyOnline from './pages/BuyOnline';
import CartPage from './pages/CartPage';
import Materials from './products/material/Material';
import MyOrders from './pages/MyOrders';
import OrderDetail from './pages/OrderDetail';
import OurCraftsmanship from './pages/OurCraftsmanship';
import FAQs from './pages/FAQs';
import TutorialDetail from './pages/TutorialDetail';

// Auth Pages
import Login from './auth/Login';
import Register from './auth/Register';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth Routes - Outside Layout */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          
          {/* Main App Routes - Inside Layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/products" element={<Product />} />
            <Route path="/buy-online" element={<BuyOnline />} />
            <Route path="/tutorial/:slug" element={<TutorialDetail />} />
            <Route path="/cart" element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            } />
            <Route path="/about" element={<About />} />
            <Route path="/contact-us" element={<Contact />} />
            <Route path="/products/materials" element={<Materials />} />
            <Route path="/my-orders" element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            } />
            <Route path="/orders/:orderId" element={
              <ProtectedRoute>
                <OrderDetail />
              </ProtectedRoute>
            } />
            <Route path="/craftsmanship" element={<OurCraftsmanship />} />
            <Route path="/faqs" element={<FAQs />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
