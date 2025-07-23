import { LinkContainer } from "react-router-bootstrap";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import Badge from "react-bootstrap/Badge";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Cookies from "universal-cookie";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function NaviBar({ token, userName, userId, setUserName, setSearchKeyword }) {
  const cookies = new Cookies();
  const [searchForm, setSearchForm] = useState("");
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  function updateForm(value) {
    setSearchForm(value);
  }

  function handleSearch() {
    setSearchKeyword(searchForm);
    if (searchForm !== "" && searchForm !== " ") navigate("/search");
  }

  function logOut() {
    cookies.remove("TOKEN", { path: "/" });
    cookies.remove("USERNAME", { path: "/" });
    cookies.remove("USERID", { path: "/" });
    setUserName(cookies.get("USERNAME"));
    window.alert("Logged out successfully :) \n");
  }

  // functions to fetch notifications
  async function getNotifications() {
    const response = await fetch(`http://localhost:5000/notifications/${userId}`);

    if (!response.ok) {
      const message = `An error occurred: ${response.statusText}`;
      console.log("notifications error : ", message);
      return;
    }

    const bids = await response.json();
    setNotifications(bids);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      getNotifications();
    }, 1000);

    return () => clearInterval(interval);
  }, [notifications.length]);

  return (
    <Navbar bg="dark" expand="lg" variant="dark" sticky="top">
      <Container fluid>
        <Navbar.Brand href="#">AuctionZone</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: "100px" }} navbarScroll>
            <LinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/register-auction">
              <Nav.Link>Register Auction</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/payment">
              <Nav.Link>Payment</Nav.Link>
            </LinkContainer>
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2 ms-2"
                aria-label="Search"
                onChange={(e) => updateForm(e.target.value)}
              />
              <Button variant="outline-light" onClick={handleSearch}>
                Search
              </Button>
            </Form>
          </Nav>

          <Nav>
            {/* if username not exists (not logged in) */}
            {userName == undefined && (
              <>
                <NavDropdown title="Login" id="loginDropdown" align="end">
                  <NavDropdown.Item as={Link} to="/login">
                    Login as User
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/adminlogin">
                    Login as Admin
                  </NavDropdown.Item>
                </NavDropdown>
                <LinkContainer to="/register">
                  <Nav.Link>Register</Nav.Link>
                </LinkContainer>
              </>
            )}

            {/* if username exists (logged in) */}
            {userName && (
              <>
                <NavDropdown
                  title={userName}
                  id="navbarScrollingDropdown"
                  style={{ marginRight: "120px" }}
                >
                  <NavDropdown.Item as={Link} to={`/profile?id=${userId}`}>
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={logOut}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NaviBar;
