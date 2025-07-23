import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Cookies from "universal-cookie";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";

export default function () {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [searchParams] = useSearchParams();
  const userId = cookies.get("USERID");
  const notificationId = searchParams.get("id");
  const [auctionId, setAuctionId] = useState("");

  // function to mark as product recieved
  async function handleDelivery(notiId) {
    const response = await fetch(`http://localhost:5000/notiUpdate/${notiId}`);

    if (!response.ok) {
      const message = `An error occurred: ${response.statusText}`;
      console.log("notifications error : ", message);
      return;
    }
    window.alert("data updated successfully");
    window.location.reload();
  }
  // functions to fetch notifications
  async function getNotifications() {
    const response = await fetch(
      `http://localhost:5000/notifications/${userId}`
    );

    if (!response.ok) {
      const message = `An error occurred: ${response.statusText}`;
      console.log("notifications error : ", message);
      return;
    }

    const notifications = await response.json();
    setNotifications(notifications);
  }

  useEffect(() => {
    getNotifications();
    return;
  }, [notifications.length]);

  return (
    <>
      {notifications.map((notification) => {
        return (
          <Card>
            <Card.Header as="h5" className="text-center">
              Congrats...! You won an auction!
            </Card.Header>
            <Card.Body>
              <Card.Text className="text-center">
                Click on the product received button only after you got the
                item.
                <br></br>
                Auction Id : {notification.auctionId}
                <br></br>
                 <Link
                    style={{ textDecoration: "none", color: "black" }}
                    to={`/profile?id=${notification.sellerId}`}
                  >Auction registered by : {notification.sellerName}</Link>
              </Card.Text>
              <div className="text-center">
                <Button
                  as={Link}
                  to={`/view-auction?id=${notification.auctionId}`}
                  variant="primary"
                  className="me-3"
                >
                  View Details
                </Button>
                {!(notification.delivered) &&
                  <Button
                    variant="success"
                    value={notification._id}
                    onClick={(e) => handleDelivery(e.target.value)}
                  >
                    I have recieved the product
                  </Button>
                }
                {(notification.delivered) &&
                  <Button
                    variant="success"
                    value={notification._id}
                    disabled
                  >
                    Item delivered
                  </Button>
                }
              </div>
            </Card.Body>
          </Card>
        );
      })}
    </>
  );
}
