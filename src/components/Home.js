import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";
import Badge from "react-bootstrap/Badge";
import Loading from "./Loading";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";
import { Button } from "react-bootstrap";

function Home() {
  const cookies = new Cookies();
  const userId = cookies.get("USERID");
  const [loading, setLoading] = useState(true);
  const [auctions, setAuctions] = useState([]);

  // This method fetches the auctions from the database.
  useEffect(() => {
    async function getAuctions() {
      const response = await fetch(`http://localhost:5000/auctions/`);

      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const auctions = await response.json();
      setAuctions(auctions);
      setLoading(false);
    }

    getAuctions();

    return;
  }, [auctions.length]);

  return loading ? (
    <Loading />
  ) : (
    <Row xs={1} md={3} className="g-4 m-5">
      {auctions.map((auction) => (
        <Col key={auction._id}>
          <Card>
            <Card.Header>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="text-start">
                  <Link
                    style={{ textDecoration: "none", color: "black" }}
                    to={`/profile?id=${auction.userId}`}
                  >
                    Registered by {auction.userName}
                  </Link>
                </div>
                <Button variant="light" className="rounded-pill border-danger">
                  <b>♡</b>
                </Button>
              </div>
            </Card.Header>
            <Link
              to={`view-auction?id=${auction._id}`}
              style={{ textDecoration: "none", color: "black" }}
            >
              <Card.Img
                variant="top"
                src={`http://localhost:5000/uploads/${auction.images[0]}`}
              />
              <Card.Body>
                <Card.Text>
                  <Card.Title>{auction.name}</Card.Title>
                  {auction.description}
                </Card.Text>
                <Card.Text>
                  <Badge bg="dark">{`Ends on : ${auction.endDate} ${auction.endTime}`}</Badge>{" "}
                </Card.Text>
                <Alert variant="secondary" className="text-center">
                <b>MINIMUM BID: ₹{auction.minimumBid}</b>
                </Alert>
              </Card.Body>
            </Link>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default Home;
