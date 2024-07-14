import React, { useState, useEffect, useRef } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { IssueApiTable } from '../../components/IssueApiTable';
import axiosInstance from '../../helpers/axiosInstance';

function TestingWrapper() {
  const [memberStatsData, setMemberStatsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [email, setEmail] = useState('');
  const [responseText, setResponseText] = useState('');
  const [emailError, setEmailError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/backend/fetch_test_api');
        setMemberStatsData(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTestApi = () => {
    setShowModal(true);
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const copyResponseText = () => {
    if (textareaRef.current) {
      textareaRef.current.select();
      document.execCommand('copy');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEmail('');
    setEmailError(false);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError(false);
  };

  const handleApiTest = async () => {
    if (!email.trim()) {
      setEmailError(true);
      return;
    }

      const response = await axiosInstance.post('/backend/merchant/issue_test_api', {
        merchant_email_id: email,
      })

    
    const simulatedApiResponse =response.data.data;
    setResponseText(simulatedApiResponse);
    handleCloseModal();
    setShowResponseModal(true);
  };

  const handleCloseResponseModal = () => {
    setShowResponseModal(false);
    setResponseText('');
  };

  return (
    <div>
      <button
        style={{
          position: 'absolute',
          top: '155px',
          fontWeight: '600',
          right: '6%',
          padding: '10px 15px',
          backgroundColor: 'transparent',
          color: 'black',
          borderRadius: '10px',
          border: '1px solid #327113',
          zIndex: 1,
        }}
        onClick={handleTestApi}
      >
        Test Partners API
      </button>

      <IssueApiTable className='' data={memberStatsData} loading={loading} />

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Test Partners API</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={handleEmailChange}
                style={{ borderColor: emailError ? 'red' : '' }}
              />
              {emailError && (
                <Form.Text className="text-danger">Email is required</Form.Text>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button style={{background:"#327113"}} className='btn-success' variant="primary" onClick={handleApiTest}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showResponseModal} onHide={handleCloseResponseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Test API</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <Form.Group controlId="formResponse">
            <Form.Control
              as="textarea"
              rows={3}
              value={responseText}
              readOnly
              ref={textareaRef}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={copyResponseText}>
            Copy API Response
          </Button>
          <Button variant="secondary" onClick={handleCloseResponseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default TestingWrapper;