import React from 'react';
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext'; // Adjust the path as necessary

const CustomNavbar = () => {
  const { isLoggedIn, logout } = useAuth(); // Access authentication context
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Call logout function from context
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <Navbar bg="light" expand="lg" collapseOnSelect>
      <Container>
        <Navbar.Brand as={NavLink} to="/">ACCOUNTS</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link as={NavLink} to="/" exact disabled={!isLoggedIn}>Home</Nav.Link>
            {/* Administrator Dropdown */}
            <Dropdown>
              <Dropdown.Toggle variant="light" id="dropdown-administrator" disabled={!isLoggedIn}>
                Administrator
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={NavLink} to="/party-details" disabled={!isLoggedIn}>
                  Party Details
                </Dropdown.Item>
                <Dropdown.Item as={NavLink} to="/quality" disabled={!isLoggedIn}>
                  Quality
                </Dropdown.Item>
                <Dropdown.Item as={NavLink} to="/firm" disabled={!isLoggedIn}>
                  Firm
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {/* Other Links */}
            <Nav.Link as={NavLink} to="/grey-purchase" disabled={!isLoggedIn}>Grey Purchase</Nav.Link>
            <Nav.Link as={NavLink} to="/dye-inward" disabled={!isLoggedIn}>Dye Inward</Nav.Link>
            
            {/* Reports Dropdown */}
            <Dropdown>
              <Dropdown.Toggle variant="light" id="dropdown-reports" disabled={!isLoggedIn}>
                Reports
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={NavLink} to="/view-grey-purchase-history" disabled={!isLoggedIn}>
                  Grey Purchase History
                </Dropdown.Item>
                <Dropdown.Item as={NavLink} to="/grey-purchase-details" disabled={!isLoggedIn}>
                  Grey Purchase Details
                </Dropdown.Item>
                <Dropdown.Item as={NavLink} to="/grey-stock" disabled={!isLoggedIn}>
                  Grey Stock
                </Dropdown.Item>
                <Dropdown.Item as={NavLink} to="/tejas-stock" disabled={!isLoggedIn}>
                  Tejas Stock
                </Dropdown.Item>
                <Dropdown.Item as={NavLink} to="/pending-stock" disabled={!isLoggedIn}>
                  Pending Stock
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {/* Modifications Dropdown */}
            <Dropdown>
              <Dropdown.Toggle variant="light" id="dropdown-modifications" disabled={!isLoggedIn}>
                Modifications
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={NavLink} to="/modify-grey-purchase" disabled={!isLoggedIn}>
                  Modify Grey Purchase
                </Dropdown.Item>
                <Dropdown.Item as={NavLink} to="/modify-dye-inward" disabled={!isLoggedIn}>
                  Modify Dye Inward
                </Dropdown.Item>
                <Dropdown.Item as={NavLink} to="/delete-grey-purchase" disabled={!isLoggedIn}>
                  Delete Grey Purchase
                </Dropdown.Item>
                <Dropdown.Item as={NavLink} to="/delete-dye-inward" disabled={!isLoggedIn}>
                  Delete Dye Inward
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
          {/* Login/Logout Button */}
          <Nav className="ms-auto">
            {isLoggedIn ? (
              <Button variant="outline-primary" onClick={handleLogout}>Logout</Button>
            ) : (
              <Button as={NavLink} to="/login" variant="outline-primary">Login</Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
 