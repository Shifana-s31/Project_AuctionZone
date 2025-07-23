import Button from "react-bootstrap/Button";
import { useState } from "react";
import {
  UNSAFE_enhanceManualRouteObjects,
  useNavigate,
} from "react-router-dom";
import Cookies from "universal-cookie";
import Form from "react-bootstrap/Form";
import "./Login.css";
import { LinkContainer } from "react-router-bootstrap";
import AlertBox from "./AlertBox";

function Login({ setToken, setUserName, setUserId }) {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showError, setShowError] = useState(false);
  const [message, setMessage] = useState("");

  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const result = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...form }),
    })
      .catch((error) => {
        window.alert(error);
        return;
      })
      .then((result) => result.json());
    console.log(result);
    // set the cookie
    cookies.set("TOKEN", result.token, {
      path: "/",
    });

    cookies.set("USERID", result.userId, {
      path: "/",
    });

    cookies.set("USERNAME", result.userName, {
      path: "/",
    });

    if (result.login) {
      setToken(result.token);
      setUserId(result.userId);
      setUserName(result.userName);
      navigate("/");
    } else {
      setShowError(true);
      setMessage(result.message);
    }
    //  setForm({ email: "", password: ""});
  }

  return (
    <div className="mt-5 centered-div">
      <h2 className="text-center">LOGIN</h2>
      <AlertBox showAlert={showError} message={message} variant="danger" />
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-4" controlId="formBasicEmail" aria-required>
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            onChange={(e) => updateForm({ email: e.target.value })}
            placeholder="Enter email"
          />
          <Form.Text className="text-muted"></Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => updateForm({ password: e.target.value })}
            placeholder="Password"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Check me out" />
        </Form.Group>
        <div className="text-center">
          <Button className="w-50" variant="primary" type="submit">
            Submit
          </Button>{" "}
          <br></br>
          <LinkContainer to="/register">
            <Button className="w-50 mt-2" variant="success" type="button">
              Register
            </Button>
          </LinkContainer>
        </div>
      </Form>
    </div>
  );
}

export default Login;
