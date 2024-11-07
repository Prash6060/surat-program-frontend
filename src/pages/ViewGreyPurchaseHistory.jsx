// src/components/ViewGreyPurchaseHistory.jsx
import React, { useEffect, useState } from 'react';
import { Table, Container, Alert, Button, Form, Row, Col } from 'react-bootstrap';
import { useAuth } from '../store/AuthContext'; // Adjust the path as necessary
import { useNavigate } from 'react-router-dom';

const ViewGreyPurchaseHistory = () => {
  const { isLoggedIn } = useAuth(); // Access authentication context
  const navigate = useNavigate();
  const [greyPurchases, setGreyPurchases] = useState([]);
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

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
        setFilteredPurchases(data.data); // Initially set filtered purchases to all data
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

  const handleFilter = () => {
    if (!fromDate || !toDate) {
      setError('Please select both From and To dates.');
      return;
    }
    
    const from = new Date(fromDate);
    const to = new Date(toDate);

    const filtered = greyPurchases.filter((purchase) => {
      const purchaseDate = new Date(purchase.grey_date_of_purchase);
      return purchaseDate >= from && purchaseDate <= to;
    });

    setFilteredPurchases(filtered);
    setError(''); // Clear any previous errors
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <Alert variant="danger">Error: {error}</Alert>;

  return (
    <Container>
      <h2 className="mt-4 mb-4">Grey Purchase List</h2>

      {/* Date Range Filter */}
      <Form className="mb-3">
        <Row className="align-items-center">
          <Col xs="12" sm="5" md="4">
            <Form.Label>From Date</Form.Label>
            <Form.Control 
              type="date" 
              value={fromDate} 
              onChange={(e) => setFromDate(e.target.value)} 
            />
          </Col>
          <Col xs="12" sm="5" md="4">
            <Form.Label>To Date</Form.Label>
            <Form.Control 
              type="date" 
              value={toDate} 
              onChange={(e) => setToDate(e.target.value)} 
            />
          </Col>
          <Col xs="12" sm="2" md="4" className="d-flex align-items-end mt-2 mt-sm-0">
            <Button variant="primary" onClick={handleFilter}>Filter</Button>
          </Col>
        </Row>
      </Form>

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
          {filteredPurchases.map((purchase, index) => (
            <tr key={index}>
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