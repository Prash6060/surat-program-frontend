import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Home = () => {
  return (
    <Container fluid>
      <Row className="text-center">
        <Col xs={12} md={8} className="mx-auto">
          <h2>Welcome to the Accounts Application</h2>
          <p>This application is designed to help manage your accounts efficiently.</p>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
