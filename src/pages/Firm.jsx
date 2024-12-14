import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Firm = () => {
  const [firmName, setFirmName] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFirmName(e.target.value.toUpperCase()); // Ensure input is capitalized
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firmName.trim()) {
      setMessage('Please enter a firm name.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/auth/add-firm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firmName }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Firm added successfully!');
        setTimeout(() => {
          navigate('/'); // Navigate to the home page after 800ms
        }, 800);
      } else {
        setMessage(result.message || 'Failed to add firm.');
      }
    } catch (error) {
      setMessage('Error: Unable to connect to the server.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h1 className="text-center mb-4">Add a Firm</h1>

              {message && (
                <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'} mb-3`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <label htmlFor="firmName" className="form-label">Firm Name:</label>
                  <input
                    type="text"
                    id="firmName"
                    value={firmName}
                    onChange={handleChange}
                    placeholder="Enter firm name"
                    className="form-control"
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">Add Firm</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Firm;
