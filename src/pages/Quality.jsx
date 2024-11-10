import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Quality = () => {
  const [qualityName, setQualityName] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setQualityName(e.target.value.toUpperCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!qualityName.trim()) {
      setMessage('Please enter a quality name.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/auth/add-quality', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quality_name: qualityName }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Quality added successfully!');
        setTimeout(() => {
          navigate('/');
        }, 800);
      } else {
        setMessage(result.message || 'Failed to add quality.');
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
              <h1 className="text-center mb-4">Add a Quality</h1>

              {message && (
                <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'} mb-3`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <label htmlFor="qualityName" className="form-label">Quality Name:</label>
                  <input
                    type="text"
                    id="qualityName"
                    value={qualityName}
                    onChange={handleChange}
                    placeholder="Enter quality name"
                    className="form-control"
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">Submit</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quality;
