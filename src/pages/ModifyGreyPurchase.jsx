import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ModifyGreyPurchase = () => {
  const [challan, setChallan] = useState('');
  const [greyPurchase, setGreyPurchase] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [purchaseFromOptions, setPurchaseFromOptions] = useState([]);
  const [partyNameOptions] = useState(['ASHISH FABS', 'RPRASHIL KUMAR']);
  const [qualityOptions, setQualityOptions] = useState([]);
  const [sentToOptions, setSentToOptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const fetchDropdownData = async () => {
    try {
      const [purchaseFromResponse, qualityResponse, sentToResponse] = await Promise.all([
        fetch('http://localhost:3000/api/auth/view-grey-parties'),
        fetch('http://localhost:3000/api/auth/view-quality'),
        fetch('http://localhost:3000/api/auth/view-dye-parties'),
      ]);

      const purchaseFromData = await purchaseFromResponse.json();
      const qualityData = await qualityResponse.json();
      const sentToData = await sentToResponse.json();

      setPurchaseFromOptions(purchaseFromData.data || []);
      setQualityOptions(qualityData.qualities || []);
      setSentToOptions(sentToData.data || []);
    } catch (err) {
      console.error('Error fetching dropdown data:', err);
    }
  };

  const handleFetchData = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await fetch(`http://localhost:3000/api/auth/view-grey-purchase-by-challan/${challan}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data. Please check the challan number.');
      }
      const data = await response.json();

      // Check if canBeModified is false
      if (data.data.canBeModified === false) {
        setError('The associated challan already has a dye inward entry and cannot be modified.');
        setGreyPurchase(null); // Clear any previous data
      } else {
        setGreyPurchase(data.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleModify = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await fetch(`http://localhost:3000/api/auth/modify-grey-purchase/${greyPurchase._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(greyPurchase),
      });
      if (!response.ok) {
        throw new Error('Failed to modify the grey purchase data.');
      }
      setSuccess('Grey purchase data successfully modified!');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGreyPurchase({
      ...greyPurchase,
      [name]: name === "grey_total_roll" ? parseInt(value, 10) : value,
    });
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Modify Grey Purchase</h1>

      <Form>
        <Row className="justify-content-center">
          <Col xs={12} sm={8} md={6} lg={4}>
            <Form.Group controlId="challanNumber">
              <Form.Label>Challan Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Challan Number"
                value={challan}
                onChange={(e) => setChallan(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col xs="auto" className="d-flex align-items-end">
            <Button variant="primary" onClick={handleFetchData} disabled={!challan || loading}>
              {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Fetch Data'}
            </Button>
          </Col>
        </Row>
      </Form>

      {error && <Alert variant="danger" className="mt-3 text-center">{error}</Alert>}
      {success && <Alert variant="success" className="mt-3 text-center">{success}</Alert>}

      {greyPurchase && (
        <Form className="mt-4">
          <Row>
            <Col md={6}>
              <Form.Group controlId="greyPurchaseFrom">
                <Form.Label>Purchase From</Form.Label>
                <Form.Control
                  as="select"
                  name="grey_purchase_from"
                  value={greyPurchase.grey_purchase_from}
                  onChange={handleChange}
                >
                  <option value="">Select Purchase From</option>
                  {purchaseFromOptions.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="greyDateOfPurchase">
                <Form.Label>Date of Purchase</Form.Label>
                <Form.Control
                  type="date"
                  name="grey_date_of_purchase"
                  value={new Date(greyPurchase.grey_date_of_purchase).toISOString().split('T')[0]}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="greyBillNo">
                <Form.Label>Bill No</Form.Label>
                <Form.Control
                  type="text"
                  name="grey_bill_no"
                  value={greyPurchase.grey_bill_no}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="greyPartyName">
                <Form.Label>Party Name</Form.Label>
                <Form.Control
                  as="select"
                  name="grey_party_name"
                  value={greyPurchase.grey_party_name}
                  onChange={handleChange}
                >
                  <option value="">Select Party Name</option>
                  {partyNameOptions.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="greyPurchaseQuality">
                <Form.Label>Purchase Quality</Form.Label>
                <Form.Control
                  as="select"
                  name="grey_purchase_quality"
                  value={greyPurchase.grey_purchase_quality}
                  onChange={handleChange}
                >
                  <option value="">Select Quality</option>
                  {qualityOptions.map((quality) => (
                    <option key={quality._id} value={quality.quality_name}>{quality.quality_name}</option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="greyTotalRoll">
                <Form.Label>Total Roll</Form.Label>
                <Form.Control
                  type="number"
                  name="grey_total_roll"
                  value={greyPurchase.grey_total_roll}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="greyTotalNetWtg">
                <Form.Label>Total Net Weight</Form.Label>
                <Form.Control
                  type="number"
                  name="grey_total_net_wtg"
                  value={greyPurchase.grey_total_net_wtg}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="greyTotalBillAmt">
                <Form.Label>Total Bill Amount</Form.Label>
                <Form.Control
                  type="number"
                  name="grey_total_bill_amt"
                  value={greyPurchase.grey_total_bill_amt}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="greySentTo">
                <Form.Label>Sent To</Form.Label>
                <Form.Control
                  as="select"
                  name="grey_sent_to"
                  value={greyPurchase.grey_sent_to}
                  onChange={handleChange}
                >
                  <option value="">Select Sent To</option>
                  {sentToOptions.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row className="justify-content-center mt-4">
            <Col xs="auto">
              <Button variant="primary" onClick={handleModify} disabled={loading}>
                {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Modify'}
              </Button>
            </Col>
          </Row>
        </Form>
      )}
    </Container>
  );
};

export default ModifyGreyPurchase;
