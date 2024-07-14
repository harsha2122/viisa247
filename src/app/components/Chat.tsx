import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { IoMdSend } from "react-icons/io";

const Chats = () => {
  return (
    <Container>
      <Row>
        <Col>
          <h2>Merchant chat</h2>
        </Col>
      </Row>
      <Row>
        <Col>
          <div style={{ height: '300px', border: '1px solid #ccc', overflowY: 'scroll' }}>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
        <Form>
          <Form.Group controlId="messageForm" style={{ position: 'relative' }}>
            <Form.Control type="text" placeholder="Type your message..." style={{ marginBottom: '10px', paddingRight: '40px', borderRadius:"20px", paddingLeft:"20px" }} />
            <Button
              style={{ position: 'absolute', right: '0', bottom: '0', background: '#327113', border: 'none', padding:"9px 10px", borderRadius:"20px" }}
              variant="success"
              type="submit"
            >
              <IoMdSend style={{ fontSize: '20px', color: 'white' }} />
            </Button>
          </Form.Group>
        </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Chats;
