import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './store/AuthContext'; // Import AuthProvider
import CustomNavbar from './components/CustomNavbar';
import Home from './pages/Home';
import PartyDetails from './pages/PartyDetails'; 
import Quality from './pages/Quality'; // Import new Quality page
import GreyPurchase from './pages/GreyPurchase';
import Login from './pages/Login';
import ViewGreyPurchaseHistory from './pages/ViewGreyPurchaseHistory';
import GreyPurchaseDetails from './pages/GreyPurchaseDetails'; // Import new page
import GreyStock from './pages/GreyStock'; // Import new page
import DyeInward from './pages/DyeInward';
import TejasStock from './pages/TejasStock';
import PendingStock from './pages/PendingStock';
import ModifyGreyPurchase from './pages/ModifyGreyPurchase';
import DeleteGreyPurchase from './pages/DeleteGreyPurchase';
import Footer from './components/Footer'

const App = () => {
  return (
    <AuthProvider> {/* Wrap Router with AuthProvider */}
      <Router>
        <CustomNavbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/party-details" element={<PartyDetails />} />
          <Route path="/quality" element={<Quality />} /> {/* New route for Quality */}
          <Route path="/grey-purchase" element={<GreyPurchase />} />
          <Route path="/login" element={<Login />} />
          <Route path="/view-grey-purchase-history" element={<ViewGreyPurchaseHistory />} />
          <Route path="/grey-purchase-details" element={<GreyPurchaseDetails />} /> {/* New route */}
          <Route path="/grey-stock" element={<GreyStock />} /> {/* New route */}
          <Route path="/dye-inward" element={<DyeInward />} /> {/* New route */}
          <Route path="/tejas-stock" element={<TejasStock />} /> {/* New route */}
          <Route path="/pending-stock" element={<PendingStock />} /> {/* New route */}
          <Route path="/modify-grey-purchase" element={<ModifyGreyPurchase />} /> {/* New route */}
          <Route path="/delete-grey-purchase" element={<DeleteGreyPurchase />} /> {/* New route */}
          {/* Other routes can go here */}
        </Routes>
        {/* <Footer /> */}
      </Router> 
    </AuthProvider>
  );
};

export default App;
