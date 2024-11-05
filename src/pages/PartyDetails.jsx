import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import '../style/PartyDetails.css';

const PartyDetails = () => {
  const [selectedPartyType, setSelectedPartyType] = useState('');
  const [partyName, setPartyName] = useState('');
  const [gstin, setGstin] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the data to be sent in the POST request
    const postData = {
      partyType: selectedPartyType,
      partyName: partyName,
      gstin: gstin,
      address: address,
    };

    try {
      const response = await fetch('http://localhost:3000/api/auth/add-party-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        // Successful response handling
        const responseData = await response.json();
        alert('Party details added successfully!');
        console.log(responseData);
        // Reset the form after successful submission (optional)
        setSelectedPartyType('');
        setPartyName('');
        setGstin('');
        setAddress('');
      } else {
        // Error handling
        const errorData = await response.json();
        alert(`Failed to add party details: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error adding party details:', error);
      alert('An error occurred while adding the party details. Please try again.');
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center">ENTER PARTY DETAILS</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="partyType">
          <Form.Label>Select Party Type</Form.Label>
          <Form.Control 
            as="select" 
            value={selectedPartyType} 
            onChange={(e) => setSelectedPartyType(e.target.value)} 
            required
          >
            <option value="">Choose...</option>
            <option value="grey-party">Grey Party</option>
            <option value="dye-party">Dye Party</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="partyName">
          <Form.Label>Party Name</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Enter party name" 
            value={partyName} 
            onChange={(e) => setPartyName(e.target.value)} 
            required
          />
        </Form.Group>

        <Form.Group controlId="gstin">
          <Form.Label>GSTIN</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Enter GSTIN" 
            value={gstin} 
            onChange={(e) => setGstin(e.target.value)} 
            required
          />
        </Form.Group>

        <Form.Group controlId="address">
          <Form.Label>Address</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Enter address" 
            value={address} 
            onChange={(e) => setAddress(e.target.value)} 
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Submit
        </Button>
      </Form>
    </Container>
  );
};

export default PartyDetails;
