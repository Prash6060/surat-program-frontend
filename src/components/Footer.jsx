import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#f1f1f1',
        color: '#333',
        padding: '0.5rem 0',
        position: 'fixed',
        bottom: 0,
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 -1px 5px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Container>
        <p className="mb-0">
          &copy; {new Date().getFullYear()} Gogo Garments. All rights reserved.
        </p>
        {/* <p className="mb-0">Made with ❤️ by Gogo Garments Team</p> */}
      </Container>
    </footer>
  );
};

export default Footer;
