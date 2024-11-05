import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './store/AuthContext'; // Import AuthProvider
import CustomNavbar from './components/CustomNavbar';
import Home from './pages/Home';
import PartyDetails from './pages/PartyDetails'; 
import GreyPurchase from './pages/GreyPurchase';
import Login from './pages/Login';
import ViewGreyPurchaseHistory from './pages/ViewGreyPurchaseHistory';
import GreyPurchaseDetails from './pages/GreyPurchaseDetails'; // Import new page
import GreyStock from './pages/GreyStock'; // Import new page
import DyeInward from './pages/DyeInward';

const App = () => {
  return (
    <AuthProvider> {/* Wrap Router with AuthProvider */}
      <Router>
        <CustomNavbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/party-details" element={<PartyDetails />} />
          <Route path="/grey-purchase" element={<GreyPurchase />} />
          <Route path="/login" element={<Login />} />
          <Route path="/view-grey-purchase-history" element={<ViewGreyPurchaseHistory />} />
          <Route path="/grey-purchase-details" element={<GreyPurchaseDetails />} /> {/* New route */}
          <Route path="/grey-stock" element={<GreyStock />} /> {/* New route */}
          <Route path="/dye-inward" element={<DyeInward />} /> {/* New route */}
          {/* Other routes can go here */}
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
