import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const DeleteGreyPurchase = () => {
  const [challanNo, setChallanNo] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!challanNo) {
      setError('Challan No is required.');
      return;
    }

    // Simulate a successful deletion process
    try {
      // Here you can make the API request to delete the grey purchase by challanNo
      // const response = await fetch(`/api/delete-grey-purchase/${challanNo}`, { method: 'DELETE' });
      // if (response.ok) {
      //     setSuccessMessage('Grey purchase deleted successfully.');
      // } else {
      //     setError('Failed to delete grey purchase.');
      // }

      // Simulating success for now
      setSuccessMessage('Grey purchase deleted successfully!');
      setTimeout(() => {
        navigate('/'); // Navigate to the home page after 1 second
      }, 1000);
    } catch (err) {
      setError('An error occurred while deleting the grey purchase. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    setChallanNo(e.target.value.toUpperCase()); // Convert input to uppercase
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center">Delete Grey Purchase</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <Form onSubmit={handleDelete}>
        <Form.Group controlId="challanNo" className="mb-3">
          <Form.Label>Challan No</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Challan No"
            value={challanNo}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Button variant="danger" type="submit">
          Submit
        </Button>
      </Form>
    </Container>
  );
};

export default DeleteGreyPurchase;
