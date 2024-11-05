import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';

const GreyPurchaseForm = () => {
  const [billNo, setBillNo] = useState('');
  const [purchaseDetails, setPurchaseDetails] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPurchaseDetails(null);

    try {
      const response = await fetch(`http://localhost:3000/api/auth/view-grey-purchase`);
      const data = await response.json();

      // Find the purchase details matching the entered bill number
      const purchase = data.data.find(item => item.grey_bill_no === billNo);
      
      if (purchase) {
        setPurchaseDetails(purchase);
      } else {
        setError('No purchase found with the provided bill number.');
      }
    } catch (err) {
      setError('An error occurred while fetching the data.');
    }
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">View Grey Purchase</h1>
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="billNo">
              <Form.Label>Bill Number:</Form.Label>
              <Form.Control
                type="text"
                value={billNo}
                onChange={(e) => setBillNo(e.target.value)}
                required
                placeholder="Enter Bill Number"
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3 w-100">Submit</Button>
          </Form>
          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
          {purchaseDetails && (
            <div className="mt-4">
              <h2 className="text-center">Purchase Details</h2>
              <div className="border p-3 rounded">
                <p><strong>From:</strong> {purchaseDetails.grey_purchase_from}</p>
                <p><strong>Date of Purchase:</strong> {new Date(purchaseDetails.grey_date_of_purchase).toLocaleDateString()}</p>
                <p><strong>Challan No:</strong> {purchaseDetails.grey_challan_no}</p>
                <p><strong>Bill No:</strong> {purchaseDetails.grey_bill_no}</p>
                <p><strong>Party Name:</strong> {purchaseDetails.grey_party_name}</p>
                <p><strong>Quality:</strong> {purchaseDetails.grey_purchase_quality}</p>
                <p><strong>Total Rolls:</strong> {purchaseDetails.grey_total_roll}</p>
                <p><strong>Total Net Weight:</strong> {purchaseDetails.grey_total_net_wtg} kg</p>
                <p><strong>Total Bill Amount:</strong> ₹{purchaseDetails.grey_total_bill_amt}</p>
                <p><strong>Sent To:</strong> {purchaseDetails.grey_sent_to}</p>
              </div>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default GreyPurchaseForm;
