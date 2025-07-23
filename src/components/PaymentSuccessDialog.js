// PaymentSuccessDialog.js
import React from "react";
import { Modal, Button } from "react-bootstrap";
import { BsCheckCircle } from "react-icons/bs";
import "./PaymentSuccessDialog.css";

function PaymentSuccessDialog({ show, onClose, amount }) {
  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      dialogClassName="custom-success-modal"
    >
      <Modal.Body className="text-center p-4">
        <BsCheckCircle className="success-icon mb-3" size={50} />
        <h4 className="mb-3">Payment Successful!</h4>
        <p className="mb-4">
          Thank you for your payment of <strong>₹{amount}</strong>. Your transaction has been completed.
        </p>
        <Button variant="primary" onClick={onClose}>
          Continue
        </Button>
      </Modal.Body>
    </Modal>
  );
}

export default PaymentSuccessDialog;
