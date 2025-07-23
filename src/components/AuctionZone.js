import React from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./AuctionZone.css"; // Add CSS for styling

function AuctionZone() {
  const navigate = useNavigate();

  const handleUserButtonClick = () => {
    navigate("/registered-users");
  };

  return (
    <div className="auction-zone">
      <h1 className="text-center">AuctionZone</h1>
      
      <div className="box-container">
        <Card className="info-box">
          <Card.Body>
            <Card.Title>Registered Users</Card.Title>
            <Button variant="success" onClick={handleUserButtonClick} className="mt-3 colorful-button">
              View Registered Users
            </Button>
          </Card.Body>
        </Card>

        <Card className="info-box">
          <Card.Body>
            <Card.Title>Payment Status</Card.Title>
            <Button variant="info" className="mt-3 colorful-button">
              View Payment Status
            </Button>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default AuctionZone;
