import React, { useEffect, useState } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

const PendingStock = () => {
    const [pendingStocks, setPendingStocks] = useState([]);
    const [filteredStocks, setFilteredStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [purchaseFrom, setPurchaseFrom] = useState('');
    const [sentTo, setSentTo] = useState('');
    const [purchaseFromOptions, setPurchaseFromOptions] = useState([]);
    const [sentToOptions, setSentToOptions] = useState([]);

    // Fetch pending stock data
    useEffect(() => {
        const fetchPendingStockData = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/auth/view-pending-stock');
                if (!response.ok) {
                    throw new Error('Failed to fetch pending stock data');
                }
                const data = await response.json();
                setPendingStocks(data.data);
                setFilteredStocks(data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPendingStockData();
    }, []);

    // Fetch Purchase From options
    useEffect(() => {
        const fetchPurchaseFromData = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/auth/view-grey-parties');
                if (!response.ok) {
                    throw new Error('Failed to fetch purchase from options');
                }
                const data = await response.json();
                setPurchaseFromOptions(data.data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchPurchaseFromData();
    }, []);

    // Fetch Sent To options
    useEffect(() => {
        const fetchSentToData = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/auth/view-dye-parties');
                if (!response.ok) {
                    throw new Error('Failed to fetch sent to options');
                }
                const data = await response.json();
                setSentToOptions(data.data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchSentToData();
    }, []);

    const handleFilter = () => {
        let filtered = pendingStocks;

        if (fromDate && toDate) {
            const from = new Date(fromDate);
            const to = new Date(toDate);
            filtered = filtered.filter(stock => {
                const purchaseDate = new Date(stock.grey_purchase_date);
                return purchaseDate >= from && purchaseDate <= to;
            });
        }

        if (purchaseFrom) {
            filtered = filtered.filter(stock => stock.grey_purchase_from.includes(purchaseFrom));
        }

        if (sentTo) {
            filtered = filtered.filter(stock => stock.grey_sent_to.includes(sentTo));
        }

        setFilteredStocks(filtered);
    };

    const handleExport = () => {
        const dataToExport = filteredStocks.map(stock => ({
            "Grey Quality": stock.grey_purchase_quality,
            "Total Roll": stock.grey_purchase_total_roll,
            "Bill No": stock.grey_purchase_billno,
            "Challan No": stock.grey_purchase_challan,
            "Grey Purchase Date": new Date(stock.grey_purchase_date).toLocaleDateString(),
            "Grey Purchase Firm": stock.grey_purchase_from,
            "Dye Firm": stock.grey_sent_to,
            "Status": stock.status,
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "PendingStock");
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, 'PendingStock.xlsx');
    };

    if (loading) {
        return <div className="text-center mt-5"><strong>Loading...</strong></div>;
    }

    if (error) {
        return <div className="alert alert-danger text-center mt-5">Error: {error}</div>;
    }

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Pending Stock Entries</h1>

            {/* Filters */}
            <Form className="mb-4">
                <Row>
                    <Col xs={12} sm={6} md={3}>
                        <Form.Group>
                            <Form.Label>From Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={12} sm={6} md={3}>
                        <Form.Group>
                            <Form.Label>To Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={12} sm={6} md={3}>
                        <Form.Group>
                            <Form.Label>Purchase From</Form.Label>
                            <Form.Control
                                as="select"
                                value={purchaseFrom}
                                onChange={(e) => setPurchaseFrom(e.target.value)}
                            >
                                <option value="">Select Purchase From</option>
                                {purchaseFromOptions.map((option, index) => (
                                    <option key={index} value={option}>{option}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col xs={12} sm={6} md={3}>
                        <Form.Group>
                            <Form.Label>Sent To</Form.Label>
                            <Form.Control
                                as="select"
                                value={sentTo}
                                onChange={(e) => setSentTo(e.target.value)}
                            >
                                <option value="">Select Sent To</option>
                                {sentToOptions.map((option, index) => (
                                    <option key={index} value={option}>{option}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
                <Button variant="primary" className="mt-3" onClick={handleFilter}>Apply Filters</Button>
            </Form>

            <div className="table-responsive">
                <table className="table table-striped table-bordered">
                    <thead className="thead-light">
                        <tr>
                            <th>Sr. No</th>
                            <th>Grey Quality</th>
                            <th>Total Roll</th>
                            <th>Bill No</th>
                            <th>Challan No</th>
                            <th>Grey Purchase Date</th>
                            <th>Grey Purchase Firm</th>
                            <th>Dye Firm</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStocks.map((stock, index) => (
                            <tr key={stock._id}>
                                <td>{index + 1}</td>
                                <td>{stock.grey_purchase_quality}</td>
                                <td>{stock.grey_purchase_total_roll}</td>
                                <td>{stock.grey_purchase_billno}</td>
                                <td>{stock.grey_purchase_challan}</td>
                                <td>{new Date(stock.grey_purchase_date).toLocaleDateString()}</td>
                                <td>{stock.grey_purchase_from}</td>
                                <td>{stock.grey_sent_to}</td>
                                <td>{stock.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Export Button */}
            <div className="text-right mt-3">
                <Button variant="success" onClick={handleExport}>Export to Excel</Button>
            </div>
        </div>
    );
};

export default PendingStock;
