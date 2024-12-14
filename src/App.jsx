import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './store/AuthContext'; // Import AuthProvider
import CustomNavbar from './components/CustomNavbar';
import Home from './pages/Home';
import PartyDetails from './pages/PartyDetails';
import Quality from './pages/Quality'; 
import GreyPurchase from './pages/GreyPurchase';
import DyeInward from './pages/DyeInward';
import Login from './pages/Login';
import ViewGreyPurchaseHistory from './pages/ViewGreyPurchaseHistory';
import GreyPurchaseDetails from './pages/GreyPurchaseDetails';
import GreyStock from './pages/GreyStock';
import TejasStock from './pages/TejasStock';
import PendingStock from './pages/PendingStock';
import ModifyGreyPurchase from './pages/ModifyGreyPurchase';
import DeleteGreyPurchase from './pages/DeleteGreyPurchase';
import Firm from './pages/Firm'; // New Import

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <CustomNavbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/party-details" element={<PartyDetails />} />
          <Route path="/quality" element={<Quality />} />
          <Route path="/grey-purchase" element={<GreyPurchase />} />
          <Route path="/dye-inward" element={<DyeInward />} />
          <Route path="/view-grey-purchase-history" element={<ViewGreyPurchaseHistory />} />
          <Route path="/grey-purchase-details" element={<GreyPurchaseDetails />} />
          <Route path="/grey-stock" element={<GreyStock />} />
          <Route path="/tejas-stock" element={<TejasStock />} />
          <Route path="/pending-stock" element={<PendingStock />} />
          <Route path="/modify-grey-purchase" element={<ModifyGreyPurchase />} />
          <Route path="/delete-grey-purchase" element={<DeleteGreyPurchase />} />
          <Route path="/firm" element={<Firm />} /> {/* New Route */}
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router> 
    </AuthProvider>
  );
};

export default App;
