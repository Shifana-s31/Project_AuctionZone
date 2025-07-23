import React, { useState, useEffect } from "react";
import { Col, Container, Row, Card, Button } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import Loading from "./Loading";
import Cookies from "universal-cookie";
import { Link } from "react-router-dom";
import Badge from "react-bootstrap/Badge";
import { Alert } from "react-bootstrap";

export default function Profile(props) {
  const cookies = new Cookies();
  const [user, setUser] = useState([]);
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("id"); // user id on url
  const currentUserId = cookies.get("USERID"); // logged user id
  const [loading, setLoading] = useState(true);
  const [auctions, setAuctions] = useState([]);
  // This method fetches the user from the database.
  useEffect(() => {
    async function getUser() {
      const response = await fetch(`http://localhost:5000/user/${userId}`);

      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const user = await response.json();
      setUser(user);
      setLoading(false);
    }

    async function getAuctions() {
      const response = await fetch(`http://localhost:5000/auctions/${userId}`);

      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const auctions = await response.json();
      setAuctions(auctions);
    }

    getUser();
    getAuctions();

    return;
  }, [user.length]);
   const handleDelete =async (auctionId)=>{
    const confirmed= window.confirm("Are u sure you want to delete this auction?");
    if(!confirmed) return;
    const response=await fetch ('http://localhost:5000/auction/delete/${auctionId},{method:"DELETE",}');
      if (response.ok)
        {
        setAuctions(auctions.filter((auction)=>auction._id!==auctionId));//Remove auction from state
    } 
      else 
          {
        const message ='An error occurred: ${response.statusText}';
              window.alert(message);
          }
   };
  return loading ? (
    <Loading variant="dark" />
  ) : (
    <div style={{ backgroundColor: "#e8e8e8" }}>
      <Container className="py-5 h-100">
        <Row className="justify-content-center align-items-center h-100">
          <Col lg="1" xl="10">
            <Card>
              <Card.Body
                className="rounded-top text-white d-flex flex-row"
                style={{ backgroundColor: "#000", height: "200px" }}
              >
                <div
                  className="ms-3 mt-5 d-flex flex-column"
                  style={{ width: "150px" }}
                >
                  <Card.Img
                    src={`http://localhost:5000/uploads/${user.photo}`}
                    alt="Generic placeholder image"
                    className="mt-4 mb-1"
                    fluid="true"
                    style={{ width: "150px", zIndex: "1" }}
                  />
                </div>

                <div className="ms-5" style={{ marginTop: "130px" }}>
                  <h5>{user.firstName + " " + user.lastName}</h5>
                  <Card.Text>{user.city}</Card.Text>
                </div>
              </Card.Body>
              <div
                className="p-4 text-black"
                style={{ backgroundColor: "#f0f5f5" }}
              >
                {/* show edit profile button only for logged user's profile */}
                {userId === currentUserId && (
                  <Button
                  as={Link}
                  to={`/editprofile?id=${userId}`}
                    className="ms-4 mt-4 d-flex flex-column"
                    variant="outline-dark"
                    style={{ height: "36px" }}
                  >
                    Edit Profile
                  </Button>
                )}

               
              </div>
              <Card.Body className="text-black p-4">
                <div className="mb-5">
                  <p className="lead fw-normal mb-1">About</p>
                  <div className="p-4" style={{ backgroundColor: "#f0f5f5" }}>
                    <Card.Text className="font-italic mb-1">
                      {user.about}
                    </Card.Text>
                    <Card.Text className="font-italic mb-1">
                      Lives in {user.city}
                    </Card.Text>
                    <Card.Text className="font-italic mb-0">
                      {user.state}
                    </Card.Text>
                    <Card.Text className="font-italic mb-0">
                      Phone : {user.phone}
                    </Card.Text>
                  </div>
                </div>
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
                {/*Show delete button only if the current user is the owner of the auction */}
                currentUserId===auction.userId &&(
                   <Button variant="light"
                   className="rounded-pill border-danger" onClick={()=> handleDelete(auction._id)}
               ></Button> )
                {/* <Button variant="light" className="rounded-pill border-danger">
                  <b>❌</b>
                </Button> */}
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
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
