import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const DyeInward = () => {
  const [dyeParties, setDyeParties] = useState([]);
  const [greyQualities, setGreyQualities] = useState([]);
  const [filteredQualities, setFilteredQualities] = useState([]);
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState('');
  const [alert, setAlert] = useState('');
  const [selectedDyeFrom, setSelectedDyeFrom] = useState('');
  const [availableRolls, setAvailableRolls] = useState({}); // To hold available rolls per quality
  const [clickedRollIndex, setClickedRollIndex] = useState(null); // To track clicked roll index for showing available rolls
  const [receiveDate, setReceiveDate] = useState(new Date().toISOString().split('T')[0]); // Set default to today's date
  const navigate = useNavigate(); // Initialize navigate hook

  useEffect(() => {
    const fetchDyeParties = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/auth/view-dye-parties');
        const data = await response.json();

        if (response.ok) {
          setDyeParties(data.data);
        } else {
          setError('Failed to fetch dye parties');
        }
      } catch (error) {
        console.error('Error fetching dye parties:', error);
        setError('Failed to fetch dye parties. Please try again later.');
      }
    };

    const fetchGreyQualities = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/auth/available-grey-quality');
        const data = await response.json();

        if (response.ok) {
          setGreyQualities(data.data);
        } else {
          setError('Failed to fetch grey qualities');
        }
      } catch (error) {
        console.error('Error fetching grey qualities:', error);
        setError('Failed to fetch grey qualities. Please try again later.');
      }
    };

    fetchDyeParties();
    fetchGreyQualities();
  }, []);

  const handleDyePartyChange = (e) => {
    const selectedDyeFrom = e.target.value;
    setSelectedDyeFrom(selectedDyeFrom);

    // Filter qualities based on the selected dye party
    const filtered = greyQualities.filter((quality) => quality.sent_to === selectedDyeFrom);
    setFilteredQualities(filtered);
  };

  const handleAddEntry = () => {
    setEntries([...entries, { quality: '', challan: '', lotNo: '', roll: '', greyMtr: '', fnsMtr: '', ratePerMtr: '', amt: '' }]);
  };

  const handleDeleteEntry = (index) => {
    const updatedEntries = entries.filter((_, i) => i !== index);
    setEntries(updatedEntries);
  };

  const handleChange = (index, field, value) => {
    const updatedEntries = [...entries];
    updatedEntries[index][field] = value.toUpperCase(); // Force capitalization on user input

    if (field === 'quality') {
      const selectedQuality = filteredQualities.find(q => q.display === value.toUpperCase());
      if (selectedQuality) {
        updatedEntries[index]['challan'] = selectedQuality.challan; // Set challan value separately
        setAvailableRolls(prevState => ({
          ...prevState,
          [value.toUpperCase()]: selectedQuality.total_roll, // Update available rolls for this quality
        }));
      }
    }

    if (field === 'fnsMtr' || field === 'ratePerMtr') {
      const fnsMtr = updatedEntries[index].fnsMtr || 0;
      const ratePerMtr = updatedEntries[index].ratePerMtr || 0;
      updatedEntries[index]['amt'] = fnsMtr * ratePerMtr;
    }

    if (field === 'roll') {
      const enteredRoll = value || 0;
      if (enteredRoll > (availableRolls[updatedEntries[index].quality] || 0)) {
        setAlert(`Roll count exceeds available stock of ${(availableRolls[updatedEntries[index].quality] || 0)} for ${updatedEntries[index].quality}`);
        updatedEntries[index]['roll'] = '';
      } else {
        setAlert('');
      }
    }

    setEntries(updatedEntries);
  };

  const handleRollClick = (index) => {
    // When user clicks on the roll input, set the clicked index to display available roll
    setClickedRollIndex(index);
  };

  const handleSubmit = async () => {
    const dye_from = selectedDyeFrom;

    const grey_details = entries.map(entry => ({
      grey_quality: entry.quality,
      grey_challan: entry.challan,
      grey_lotno: entry.lotNo,
      grey_roll: parseInt(entry.roll, 10) || 0,
      grey_grey_mtr: parseInt(entry.greyMtr, 10) || 0,
      grey_fns_mtr: parseInt(entry.fnsMtr, 10) || 0,
      grey_rate_per_mtr: parseInt(entry.ratePerMtr, 10) || 0,
      grey_amt: parseInt(entry.amt, 10) || 0,
    }));

    if (!dye_from) {
      setError('Please select a dye party.');
      return;
    }
    if (grey_details.length === 0) {
      setError('Please add at least one entry.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/auth/add-dye-inward', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dye_from, grey_details, receive_date: receiveDate }), // Include receive date in request
      });

      const data = await response.json();

      if (response.ok) {
        setAlert('Dye inward entry created successfully!');
        setEntries([]);
        // Navigate to home page after 1 second delay
        setTimeout(() => {
          navigate('/'); // Navigate to home page
        }, 1000);
      } else {
        setError(data.msg || 'Failed to create dye inward entry.');
      }
    } catch (error) {
      console.error('Error submitting dye inward entry:', error);
      setError('Failed to create dye inward entry. Please try again later.');
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center">Dye Inward</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {alert && <Alert variant="success">{alert}</Alert>}

      <Form.Group controlId="dyePartySelect" className="mb-3">
        <Form.Label>Inward From</Form.Label>
        <Form.Control as="select" onChange={handleDyePartyChange}>
          <option value="">Select Dye Party</option>
          {dyeParties.map((party, index) => (
            <option key={index} value={party}>{party}</option>
          ))}
        </Form.Control>
      </Form.Group>

      {/* Container for both buttons in the same row */}
      <div className="d-flex justify-content-between mb-3">
        {/* Add Entry button on the left */}
        <Button variant="primary" onClick={handleAddEntry}>
          Add Entry
        </Button>

        {/* Date of Receive on the right */}
        <Form.Group controlId="receiveDate" className="mb-0" style={{ width: 'auto' }}>
          <Form.Label className="sr-only">Date of Receive</Form.Label>
          <Form.Control
            type="date"
            value={receiveDate}
            onChange={(e) => setReceiveDate(e.target.value)}
            style={{ width: '130px' }} // Set width for the date field
          />
        </Form.Group>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Quality</th>
            <th>Challan</th>
            <th>Lot No</th>
            <th>Roll</th>
            <th>Grey Mtr</th>
            <th>FNS Mtr</th>
            <th>Rate per Mtr</th>
            <th>Amt</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr key={index}>
              <td>
                <Form.Control
                  as="select"
                  value={entry.quality}
                  onChange={(e) => handleChange(index, 'quality', e.target.value)}
                >
                  <option value="">Select Quality</option>
                  {filteredQualities.map((quality, i) => (
                    <option key={i} value={quality.display}>
                      {quality.display}
                    </option>
                  ))}
                </Form.Control>
              </td>
              <td>
                <Form.Control
                  type="text"
                  value={entry.challan}
                  readOnly
                />
              </td>
              <td>
                <Form.Control
                  type="text"
                  value={entry.lotNo}
                  onChange={(e) => handleChange(index, 'lotNo', e.target.value)}
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  value={entry.roll}
                  onClick={() => handleRollClick(index)} // Handle roll input click
                  onChange={(e) => handleChange(index, 'roll', e.target.value)}
                />
                {clickedRollIndex === index && availableRolls[entry.quality] !== undefined && (
                  <div className="mt-2">Avail: {availableRolls[entry.quality]}</div>
                )}
              </td>
              <td>
                <Form.Control
                  type="number"
                  value={entry.greyMtr}
                  onChange={(e) => handleChange(index, 'greyMtr', e.target.value)}
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  value={entry.fnsMtr}
                  onChange={(e) => handleChange(index, 'fnsMtr', e.target.value)}
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  value={entry.ratePerMtr}
                  onChange={(e) => handleChange(index, 'ratePerMtr', e.target.value)}
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  value={entry.amt}
                  readOnly
                />
              </td>
              <td>
                <Button variant="danger" onClick={() => handleDeleteEntry(index)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Button variant="success" onClick={handleSubmit}>Submit</Button>
    </Container>
  );
};

export default DyeInward;
