import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Quality = () => {
  const [qualityName, setQualityName] = useState(''); // State to hold the quality name
  const [message, setMessage] = useState(''); // State to hold success/error message
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Handle the input change, converting text to uppercase
  const handleChange = (e) => {
    setQualityName(e.target.value.toUpperCase());
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh on submit

    // Check if the quality name is empty
    if (!qualityName.trim()) {
      setMessage('Please enter a quality name.');
      return;
    }

    try {
      // Send POST request to the endpoint to add the quality
      const response = await fetch('http://localhost:3000/api/auth/add-quality', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quality_name: qualityName }),
      });

      // Parse the response JSON
      const result = await response.json();

      // Handle the response based on the success or failure
      if (response.ok) {
        setMessage('Quality added successfully!');
        
        // After 2 seconds, navigate to the Home page
        setTimeout(() => {
          navigate('/'); // Navigate to Home
        }, 800); // 2-second delay
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
              {message && (
                <div className={`mt-3 alert ${message.includes('success') ? 'alert-success' : 'alert-danger'}`}>
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quality;
