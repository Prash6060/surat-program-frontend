// src/components/ViewGreyPurchase.jsx
import React, { useEffect, useState } from 'react';
import { Table, Container, Alert } from 'react-bootstrap';
import { useAuth } from '../store/AuthContext'; // Adjust the path as necessary
import { useNavigate } from 'react-router-dom';

const ViewGreyPurchaseHistory = () => {
  const { isLoggedIn } = useAuth(); // Access authentication context
  const navigate = useNavigate();
  const [greyPurchases, setGreyPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Redirect if user is not logged in
    if (!isLoggedIn) {
      navigate('/login'); // Redirect to login page
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const fetchGreyPurchases = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/auth/view-grey-purchase');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setGreyPurchases(data.data); // Store the grey purchases in state
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchGreyPurchases(); // Fetch data only if the user is logged in
    }
  }, [isLoggedIn]);

  if (loading) return <p>Loading...</p>;
  if (error) return <Alert variant="danger">Error: {error}</Alert>;

  return (
    <Container>
      <h2 className="mt-4 mb-4">Grey Purchase List</h2>
      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>Purchased From</th>
            <th>DOP</th>
            <th>Challan</th>
            <th>Bill</th>
            <th>Quality</th>
            <th>Sent To</th>
          </tr>
        </thead>
        <tbody>
          {greyPurchases.map((purchase) => (
            <tr key={purchase._id}>
              <td>{purchase.grey_purchase_from}</td>
              <td>{new Date(purchase.grey_date_of_purchase).toLocaleDateString()}</td>
              <td>{purchase.grey_challan_no}</td>
              <td>{purchase.grey_bill_no}</td>
              <td>{purchase.grey_purchase_quality}</td>
              <td>{purchase.grey_sent_to}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ViewGreyPurchaseHistory;
