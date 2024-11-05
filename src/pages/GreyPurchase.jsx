import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useAuth } from '../store/AuthContext'; // Adjust the import path according to your structure

const GreyPurchase = () => {
  const { isLoggedIn } = useAuth(); // Access the authentication status
  const [purchasedFrom, setPurchasedFrom] = useState('');
  const [dateOfPurchase, setDateOfPurchase] = useState('');
  const [challanNo, setChallanNo] = useState('');
  const [billNo, setBillNo] = useState('');
  const [partyName, setPartyName] = useState('');
  const [purchaseQuality, setPurchaseQuality] = useState('');
  const [totalRoll, setTotalRoll] = useState('');
  const [totalNetWtg, setTotalNetWtg] = useState('');
  const [totalBillAmt, setTotalBillAmt] = useState('');
  const [sentTo, setSentTo] = useState('');
  const [partyList, setPartyList] = useState([]);
  const [sentToList, setSentToList] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchParties = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/auth/view-grey-parties');
        const data = await response.json();
        if (response.ok) {
          setPartyList(data.data);
        } else {
          setError(data.msg || 'Failed to fetch grey parties');
        }
      } catch (error) {
        console.error('Error fetching grey parties:', error);
        setError('Failed to fetch grey parties. Please try again later.');
      }
    };

    const fetchSentToParties = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/auth/view-dye-parties');
        const data = await response.json();
        if (response.ok) {
          setSentToList(data.data);
        } else {
          setError(data.msg || 'Failed to fetch sent to parties');
        }
      } catch (error) {
        console.error('Error fetching sent to parties:', error);
        setError('Failed to fetch sent to parties. Please try again later.');
      }
    };

    fetchParties();
    fetchSentToParties();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const greyPurchaseData = {
      grey_purchase_from: purchasedFrom,
      grey_date_of_purchase: dateOfPurchase,
      grey_challan_no: challanNo,
      grey_bill_no: billNo,
      grey_party_name: partyName,
      grey_purchase_quality: purchaseQuality,
      grey_total_roll: totalRoll,
      grey_total_net_wtg: totalNetWtg,
      grey_total_bill_amt: totalBillAmt,
      grey_sent_to: sentTo,
    };

    try {
      const response = await fetch('http://localhost:3000/api/auth/add-grey-purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(greyPurchaseData),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Grey purchase added successfully:', responseData);
        setSuccessMessage('Grey purchase recorded successfully!');

        // After successful purchase, add to grey stock
        await addGreyStock();
        
        // Clear the form after successful submission
        resetForm();
      } else {
        const errorData = await response.json();
        setError(errorData.msg || 'Failed to add grey purchase');
      }
    } catch (error) {
      console.error('Error adding grey purchase:', error);
      setError('An error occurred while adding the grey purchase. Please try again.');
    }
  };

  // Function to add grey stock
  const addGreyStock = async () => {
    const greyStockData = {
      grey_purchase_quality: purchaseQuality,
      grey_purchase_total_roll: totalRoll,
      grey_purchase_billno: billNo,
      grey_purchase_challan: challanNo,
      grey_purchase_date: dateOfPurchase,
      grey_purchase_from: purchasedFrom,
    };

    try {
      const response = await fetch('http://localhost:3000/api/auth/add-grey-stock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(greyStockData),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Grey stock added successfully:', responseData);
      } else {
        const errorData = await response.json();
        console.error(errorData.msg || 'Failed to add grey stock');
      }
    } catch (error) {
      console.error('Error adding grey stock:', error);
    }
  };

  const resetForm = () => {
    setPurchasedFrom('');
    setDateOfPurchase('');
    setChallanNo('');
    setBillNo('');
    setPartyName('');
    setPurchaseQuality('');
    setTotalRoll('');
    setTotalNetWtg('');
    setTotalBillAmt('');
    setSentTo('');
    setError('');
    setSuccessMessage('');
  };

  const toUpperCase = (value) => value.toUpperCase();

  return (
    <Container className="mt-5">
      <h2 className="text-center">Record Grey Purchase</h2>
      {!isLoggedIn ? (
        <Alert variant="danger">
          Please log in to access this page.
        </Alert>
      ) : (
        <>
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="purchasedFrom">
                  <Form.Label>Purchased From</Form.Label>
                  <Form.Control 
                    as="select" 
                    value={purchasedFrom} 
                    onChange={(e) => setPurchasedFrom(e.target.value)} 
                    required
                  >
                    <option value="">Choose...</option>
                    {partyList.map((party, index) => (
                      <option key={index} value={party}>{party}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="dateOfPurchase">
                  <Form.Label>Date of Purchase</Form.Label>
                  <Form.Control 
                    type="date" 
                    value={dateOfPurchase} 
                    onChange={(e) => setDateOfPurchase(e.target.value)} 
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="challanNo">
                  <Form.Label>Challan No</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter Challan No" 
                    value={challanNo} 
                    onChange={(e) => setChallanNo(toUpperCase(e.target.value))} 
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="billNo">
                  <Form.Label>Bill No</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter Bill No" 
                    value={billNo} 
                    onChange={(e) => setBillNo(toUpperCase(e.target.value))} 
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="partyName">
                  <Form.Label>Party Name</Form.Label>
                  <Form.Control 
                    as="select" 
                    value={partyName} 
                    onChange={(e) => setPartyName(toUpperCase(e.target.value))} 
                    required
                  >
                    <option value="">Choose...</option>
                    <option value="ASHISH FABS">ASHISH FABS</option>
                    <option value="RPRASHIL KUMAR">RPRASHIL KUMAR</option>
                  </Form.Control>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="purchaseQuality">
                  <Form.Label>Purchase Quality</Form.Label>
                  <Form.Control 
                    as="select" 
                    value={purchaseQuality} 
                    onChange={(e) => setPurchaseQuality(toUpperCase(e.target.value))} 
                    required
                  >
                    <option value="">Choose...</option>
                    <option value="ZURICH 6%">ZURICH 6%</option>
                    <option value="TWO WAY">TWO WAY</option>
                    <option value="SUPER SUEDE">SUPER SUEDE</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={4}>
                <Form.Group controlId="totalRoll">
                  <Form.Label>Total Roll</Form.Label>
                  <Form.Control 
                    type="number" 
                    placeholder="Enter Total Roll" 
                    value={totalRoll} 
                    onChange={(e) => setTotalRoll(e.target.value)} 
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group controlId="totalNetWtg">
                  <Form.Label>Total Net Wtg</Form.Label>
                  <Form.Control 
                    type="number" 
                    placeholder="Enter Total Net Wtg" 
                    value={totalNetWtg} 
                    onChange={(e) => setTotalNetWtg(e.target.value)} 
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group controlId="totalBillAmt">
                  <Form.Label>Total Bill Amount</Form.Label>
                  <Form.Control 
                    type="number" 
                    placeholder="Enter Total Bill Amount" 
                    value={totalBillAmt} 
                    onChange={(e) => setTotalBillAmt(e.target.value)} 
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="sentTo">
                  <Form.Label>Sent To</Form.Label>
                  <Form.Control 
                    as="select" 
                    value={sentTo} 
                    onChange={(e) => setSentTo(e.target.value)} 
                    required
                  >
                    <option value="">Choose...</option>
                    {sentToList.map((party, index) => (
                      <option key={index} value={party}>{party}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </>
      )}
    </Container>
  );
};

export default GreyPurchase;
