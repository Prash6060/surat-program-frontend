import React, { useState, useEffect } from 'react';
import { Container, Table, Alert } from 'react-bootstrap';
import { useAuth } from '../store/AuthContext'; // Adjust the import path according to your structure

const GreyStock = () => {
  const { isLoggedIn } = useAuth(); // Access the authentication status
  const [greyStock, setGreyStock] = useState([]); // State to hold grey stock data
  const [error, setError] = useState(''); // State to hold error messages

  useEffect(() => {
    const fetchGreyStock = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/auth/view-grey-stock');
        const data = await response.json();
        
        if (response.ok) {
          setGreyStock(data.data); // Assuming response structure is { data: [...] }
        } else {
          setError(data.msg || 'Failed to fetch grey stock');
        }
      } catch (error) {
        console.error('Error fetching grey stock:', error);
        setError('Failed to fetch grey stock. Please try again later.');
      }
    };

    if (isLoggedIn) {
      fetchGreyStock(); // Fetch grey stock only if the user is logged in
    }
  }, [isLoggedIn]); // Fetch data when the component mounts or when the user login state changes

  return (
    <Container className="mt-5">
      <h2 className="text-center">Grey Stock</h2>
      {!isLoggedIn ? (
        <Alert variant="danger">
          Please log in to access this page.
        </Alert>
      ) : (
        <>
          {error && <Alert variant="danger">{error}</Alert>}
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Grey Quality</th>
                <th>Total Roll</th>
                <th>Bill No</th>
                <th>Challan No</th>
                <th>Grey Purchase Date</th>
              </tr>
            </thead>
            <tbody>
              {greyStock.map(stock => (
                <tr key={stock._id}>
                  <td>{stock.grey_purchase_quality}</td>
                  <td>{stock.grey_purchase_total_roll}</td>
                  <td>{stock.grey_purchase_billno}</td>
                  <td>{stock.grey_purchase_challan}</td>
                  <td>{new Date(stock.grey_purchase_date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </Container>
  );
};

export default GreyStock;
