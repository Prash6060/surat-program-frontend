import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useAuth } from '../store/AuthContext';
import { useNavigate } from 'react-router-dom';

const GreyPurchase = () => {
  const { isLoggedIn } = useAuth(); // Check authentication
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
  const [purchaseQualities, setPurchaseQualities] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchParties = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/auth/view-firm');
        const data = await response.json();
        if (response.ok) {
          setPartyList(data.map(firm => firm.firmName)); // Assuming firmName is the field to be displayed
        } else {
          setError(data.msg || 'Failed to fetch grey parties');
        }
      } catch (error) {
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
        setError('Failed to fetch sent to parties. Please try again later.');
      }
    };

    const fetchPurchaseQualities = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/auth/view-quality');
        const data = await response.json();
        if (response.ok) {
          setPurchaseQualities(data.qualities);
        } else {
          setError(data.msg || 'Failed to fetch purchase qualities');
        }
      } catch (error) {
        setError('Failed to fetch purchase qualities. Please try again later.');
      }
    };

    fetchParties();
    fetchSentToParties();
    fetchPurchaseQualities();
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
        setSuccessMessage('Grey purchase recorded successfully!');
        await addGreyStock(); // Update grey stock

        // After 1 second, navigate to the home page
        setTimeout(() => {
          navigate('/');
        }, 1000); // 1000 milliseconds = 1 second
      } else {
        const errorData = await response.json();
        setError(errorData.msg || 'Failed to add grey purchase');
      }
    } catch (error) {
      setError('An error occurred while adding the grey purchase. Please try again.');
    }
  };

  const addGreyStock = async () => {
    const greyStockData = {
      grey_purchase_quality: purchaseQuality,
      grey_purchase_total_roll: totalRoll,
      grey_purchase_billno: billNo,
      grey_purchase_challan: challanNo,
      grey_purchase_date: dateOfPurchase,
      grey_purchase_from: purchasedFrom,
      grey_sent_to: sentTo,
      status: "DYING", // Default status set to "DYING"
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

  const toUpperCase = (value) => value.toUpperCase();

  return (
    <Container className="mt-5">
      <h2 className="text-center">Record Grey Purchase</h2>
      {!isLoggedIn ? (
        <Alert variant="danger">Please log in to access this page.</Alert>
      ) : (
        <>
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="purchasedFrom">
                  <Form.Label>Purchased From</Form.Label>
                  <Form.Control as="select" value={purchasedFrom} onChange={(e) => setPurchasedFrom(e.target.value)} required>
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
                  <Form.Control type="date" value={dateOfPurchase} onChange={(e) => setDateOfPurchase(e.target.value)} required />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="challanNo">
                  <Form.Label>Challan No</Form.Label>
                  <Form.Control type="text" placeholder="Enter Challan No" value={challanNo} onChange={(e) => setChallanNo(toUpperCase(e.target.value))} required />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="billNo">
                  <Form.Label>Bill No</Form.Label>
                  <Form.Control type="text" placeholder="Enter Bill No" value={billNo} onChange={(e) => setBillNo(toUpperCase(e.target.value))} required />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="partyName">
                  <Form.Label>Party Name</Form.Label>
                  <Form.Control as="select" value={partyName} onChange={(e) => setPartyName(toUpperCase(e.target.value))} required>
                    <option value="">Choose...</option>
                    {partyList.map((party, index) => (
                      <option key={index} value={party}>{party}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="purchaseQuality">
                  <Form.Label>Purchase Quality</Form.Label>
                  <Form.Control as="select" value={purchaseQuality} onChange={(e) => setPurchaseQuality(toUpperCase(e.target.value))} required>
                    <option value="">Choose...</option>
                    {purchaseQualities.map((quality, index) => (
                      <option key={index} value={quality.quality_name}>
                        {quality.quality_name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="totalRoll">
                  <Form.Label>Total Roll</Form.Label>
                  <Form.Control type="number" placeholder="Enter total roll" value={totalRoll} onChange={(e) => setTotalRoll(e.target.value)} required />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="totalNetWtg">
                  <Form.Label>Total Net Weight</Form.Label>
                  <Form.Control type="number" placeholder="Enter total net weight" value={totalNetWtg} onChange={(e) => setTotalNetWtg(e.target.value)} required />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="totalBillAmt">
                  <Form.Label>Total Bill Amount</Form.Label>
                  <Form.Control type="number" placeholder="Enter total bill amount" value={totalBillAmt} onChange={(e) => setTotalBillAmt(e.target.value)} required />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="sentTo">
                  <Form.Label>Sent To</Form.Label>
                  <Form.Control as="select" value={sentTo} onChange={(e) => setSentTo(e.target.value)} required>
                    <option value="">Choose...</option>
                    {sentToList.map((party, index) => (
                      <option key={index} value={party}>{party}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <Button type="submit" variant="primary" className="w-100">
              Submit Purchase
            </Button>
          </Form>
        </>
      )}
    </Container>
  );
};

export default GreyPurchase;
