import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Form, InputGroup } from "react-bootstrap";
import PaymentSuccessDialog from "./PaymentSuccessDialog";
import "./Payment.css";

function PaymentPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Retrieve parameters from the URL
  const auctionId = searchParams.get("auctionId");
  const amount = parseInt(searchParams.get("amount")) || 0;
  const userId = searchParams.get("userId");
  const userName = searchParams.get("userName");
  const [selectedPayment, setSelectedPayment] = useState("UPI");
  const [showDialog, setShowDialog] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    upiId: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardHolderName: "",
  });

  const handlePaymentSelect = (paymentMethod) => {
    setSelectedPayment(paymentMethod);
  };

  const handleChange = (e) => {
    setPaymentDetails({
      ...paymentDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Validate the payment details based on selected payment method
    if (selectedPayment === "UPI" && !paymentDetails.upiId) {
      alert("Please enter a valid UPI ID.");
      return;
    }
    if (
      selectedPayment === "Card" &&
      (!paymentDetails.cardNumber || !paymentDetails.expiryDate || !paymentDetails.cvv || !paymentDetails.cardHolderName)
    ) {
      alert("Please complete all card details.");
      return;
    }

    setShowDialog(true); // Show payment success dialog on form submission
  };

  const handleDialogClose = () => {
    setShowDialog(false);

    // Simulate payment success and navigate back to the ViewAuction page
    alert("Payment Successful!");

    // Navigate back to the ViewAuction page with the auction ID
    // navigate(`/view-auction?id=${auctionId}`);
  };

  return (
    <div className="centered-div">
      <h2 className="mb-4 text-center">Complete Your Payment</h2>
      <div className="summary-section">
        <h4>Payment Summary</h4>
        <p>Auction Item: {userName ? `${userName}'s Bid` : "Unknown Bid"}</p>
        <p>Bid Amount: ₹{amount}</p>
        <p>Processing Fee: ₹500</p>
        <h5>Total Amount: ₹{amount + 500}</h5>
      </div>

      <Form onSubmit={handleSubmit} className="payment-options">
        <h4>Select Payment Method</h4>

        {/* UPI Payment Method */}
        <div className="payment-method">
          <Button
            variant={selectedPayment === "UPI" ? "primary" : "outline-primary"}
            onClick={() => handlePaymentSelect("UPI")}
          >
            Pay via UPI
          </Button>
          {selectedPayment === "UPI" && (
            <InputGroup className="mt-3">
              <Form.Control
                type="text"
                placeholder="Enter UPI ID (e.g., username@bank)"
                name="upiId"
                value={paymentDetails.upiId}
                onChange={handleChange}
                required
              />
            </InputGroup>
          )}
        </div>

        {/* Card Payment Method */}
        <div className="payment-method mt-3">
          <Button
            variant={selectedPayment === "Card" ? "primary" : "outline-primary"}
            onClick={() => handlePaymentSelect("Card")}
          >
            Pay via Credit/Debit Card
          </Button>
          {selectedPayment === "Card" && (
            <>
              <InputGroup className="mt-3">
                <Form.Control
                  type="text"
                  placeholder="Card Number"
                  name="cardNumber"
                  value={paymentDetails.cardNumber}
                  onChange={handleChange}
                  required
                />
              </InputGroup>
              <div className="card-details mt-3">
                <Form.Control
                  type="text"
                  placeholder="Expiry Date (MM/YY)"
                  className="me-3"
                  name="expiryDate"
                  value={paymentDetails.expiryDate}
                  onChange={handleChange}
                  required
                />
                <Form.Control
                  type="text"
                  placeholder="CVV"
                  name="cvv"
                  value={paymentDetails.cvv}
                  onChange={handleChange}
                  required
                />
              </div>
              <Form.Control
                type="text"
                placeholder="Cardholder Name"
                className="mt-3"
                name="cardHolderName"
                value={paymentDetails.cardHolderName}
                onChange={handleChange}
                required
              />
            </>
          )}
        </div>

        <Button type="submit" className="mt-4 w-100">
          Pay ₹{amount + 500}
        </Button>
      </Form>

      <PaymentSuccessDialog
        show={showDialog}
        onClose={handleDialogClose}
        amount={amount + 500}
      />
    </div>
  );
}

export default PaymentPage;
