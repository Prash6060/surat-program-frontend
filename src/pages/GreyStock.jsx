import React, { useState, useEffect } from 'react';
import { Container, Table, Alert, Button } from 'react-bootstrap';
import { useAuth } from '../store/AuthContext'; // Adjust the import path according to your structure
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';  // Import jsPDF autotable plugin

const GreyStock = () => {
  const { isLoggedIn } = useAuth();
  const [greyStock, setGreyStock] = useState([]);
  const [error, setError] = useState('');
  const [hideEmptyRolls, setHideEmptyRolls] = useState(false);

  useEffect(() => {
    const fetchGreyStock = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/auth/view-grey-stock');
        const data = await response.json();

        if (response.ok) {
          setGreyStock(data.data);
        } else {
          setError(data.msg || 'Failed to fetch grey stock');
        }
      } catch (error) {
        setError('Failed to fetch grey stock. Please try again later.');
      }
    };

    if (isLoggedIn) {
      fetchGreyStock();
    }
  }, [isLoggedIn]);

  // Filter grey stock based on hideEmptyRolls state
  const filteredGreyStock = hideEmptyRolls
    ? greyStock.filter(stock => stock.grey_purchase_total_roll > 0)
    : greyStock;

  const handleExportExcel = () => {
    const dataToExport = filteredGreyStock.map(stock => ({
      "Grey Quality": stock.grey_purchase_quality,
      "Total Roll": stock.grey_purchase_total_roll,
      "Bill No": stock.grey_purchase_billno,
      "Challan No": stock.grey_purchase_challan,
      "Grey Purchase Date": new Date(stock.grey_purchase_date).toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "GreyStock");
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'GreyStock.xlsx');
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Grey Stock Entries", 14, 20);

    const tableColumn = ["Sr. No", "Grey Quality", "Total Roll", "Bill No", "Challan No", "Grey Purchase Date"];
    const tableRows = filteredGreyStock.map((stock, index) => [
      index + 1,
      stock.grey_purchase_quality,
      stock.grey_purchase_total_roll,
      stock.grey_purchase_billno,
      stock.grey_purchase_challan,
      new Date(stock.grey_purchase_date).toLocaleDateString(),
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });

    doc.save('GreyStock.pdf');
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center">Grey Stock</h2>

      {!isLoggedIn ? (
        <Alert variant="danger">Please log in to access this page.</Alert>
      ) : (
        <>
          {error && <Alert variant="danger">{error}</Alert>}

          <div className="d-flex justify-content-end mb-3">
            <Button
              variant="info"
              style={{ fontSize: '0.8rem' }}
              onClick={() => setHideEmptyRolls(prev => !prev)}
            >
              {hideEmptyRolls ? 'Show All Entries' : 'Hide Empty Roll Stock'}
            </Button>
          </div>

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
              {filteredGreyStock.map((stock, index) => (
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

          {/* Export Buttons */}
          <div className="d-flex justify-content-start mt-4">
            <Button variant="success" onClick={handleExportExcel} className="mr-2">Export to Excel</Button>
            <Button variant="danger" onClick={handleExportPDF}>Export to PDF</Button>
          </div>
        </>
      )}
    </Container>
  );
};

export default GreyStock;
