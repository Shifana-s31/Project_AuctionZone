import React, { useState, useEffect } from "react";
import { useNavigate, createSearchParams, Link } from "react-router-dom";
import Cookies from "universal-cookie";
import formData from "form-data";
import Button from "react-bootstrap/Button";
import AlertBox from "./AlertBox";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import "./Login.css";

function Register() {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const [validated, setValidated] = useState(false);
  const [errorString, setErrorString] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    city: "",
    state: "",
    zip: "",
    about: "",
    photo: "",
  });
  // scroll to top on render and change in errorString
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [errorString]);

  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  async function handleSubmit(event) {
    console.log(form.photo);

    const bootform = event.currentTarget;
    event.preventDefault();
    let passwordMatch = true;
    let passwordLength = true;
    let errStr = "";
    // if password and confirm password don't match set passwordMatch false
    if (form.password != form.confirmPassword) {
      errStr += "Password and Confirm Password must be same..!\n";
      setErrorString(errStr);
      setShowAlert(true);
      passwordMatch = false;
    }
    if (form.password.length < 6) {
      errStr += "Password should be atleast 6 characters..!\n";
      setErrorString(errStr);
      setShowAlert(true);
      passwordLength = false;
    }

    if (
      bootform.checkValidity() === false ||
      !passwordMatch ||
      !passwordLength
    ) {
      // console.log(errorString);
      // window.alert(errorString);
      setErrorString(errStr);
      event.preventDefault();
      event.stopPropagation();
    } else {
      // When a post request is sent to the create url, we'll add a new record to the database.
      const newPerson = { ...form };
      const newUser = new formData();
      for (var key in newPerson) {
        newUser.append(key, newPerson[key]);
      }

      const result = await fetch("http://localhost:5000/user/add", {
        method: "POST",
        body: newUser,
      })
        .catch((error) => {
          window.alert(error);
          return;
        })
        .then((result) => result.json());

      // if registered successfully
      if (result.registered) {
        window.alert("Account created Successfully !");
        setForm({
          firstName: "",
          lastName: "",
          phone: "",
          email: "",
          password: "",
          confirmPassword: "",
          city: "",
          state: "",
          zip: "",
          about: "",
        });
        console.log("reg :: ", result._id);
        navigate("/login");
      } else {
        // window.alert(`Failed to create account due to ${result.message}`);
        errStr += result.message;
        setErrorString(errStr);
        setShowAlert(true);
      }
    }
    setValidated(true);
  }

  return (
    <div className="centered-div">
      <AlertBox
        variant={"danger"}
        showAlert={showAlert}
        message={errorString}
      />
      <h2 className="mb-5 text-center">REGISTER</h2>
      <Form
        noValidate
        validated={validated}
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <Row className="mb-3">
          <Form.Group as={Col} md="4" controlId="validationCustom01">
            <Form.Label>First name</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="First name"
              value={form.firstName}
              onChange={(e) => updateForm({ firstName: e.target.value })}
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="validationCustom02">
            <Form.Label>Last name</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Last name"
              value={form.lastName}
              onChange={(e) => updateForm({ lastName: e.target.value })}
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="validationCustomUsername01">
            <Form.Label>Phone</Form.Label>
            <InputGroup hasValidation>
              <InputGroup.Text id="inputGroupPrepend">+91</InputGroup.Text>
              <Form.Control
                type="number"
                placeholder="Phone Number"
                aria-describedby="inputGroupPrepend"
                required
                value={form.phone}
                onChange={(e) => updateForm({ phone: e.target.value })}
              />
              <Form.Control.Feedback type="invalid">
                Please enter your phone number.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="validationCustomUsername02">
            <Form.Label>Email</Form.Label>
            <InputGroup hasValidation>
              <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
              <Form.Control
                type="email"
                placeholder="Email"
                aria-describedby="inputGroupPrepend"
                required
                value={form.email}
                onChange={(e) => updateForm({ email: e.target.value })}
              />
              <Form.Control.Feedback type="invalid">
                Please enter your email.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="validationCustom03">
            <Form.Label>Password</Form.Label>
            <Form.Control
              required
              type="password"
              placeholder="password"
              value={form.password}
              onChange={(e) => updateForm({ password: e.target.value })}
            />
            <Form.Control.Feedback type="invalid">
              Password must be greater than 6
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} controlId="validationCustom04">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              required
              type="password"
              placeholder="Re-enter your password"
              value={form.confirmPassword}
              onChange={(e) => updateForm({ confirmPassword: e.target.value })}
            />
            <Form.Control.Feedback type="invalid">
              Password must be greater than 6
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="6" controlId="validationCustom05">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              placeholder="City"
              required
              value={form.city}
              onChange={(e) => updateForm({ city: e.target.value })}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid city.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="3" controlId="validationCustom06">
            <Form.Label>State</Form.Label>
            <Form.Control
              type="text"
              placeholder="State"
              required
              value={form.state}
              onChange={(e) => updateForm({ state: e.target.value })}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid state.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="3" controlId="validationCustom07">
            <Form.Label>Zip</Form.Label>
            <Form.Control
              type="text"
              placeholder="Zip"
              required
              value={form.zip}
              onChange={(e) => updateForm({ zip: e.target.value })}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid zip.
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row>
          <Form.Group as={Col} className="mb-3" controlId="validationCustom08">
            <Form.Label>About</Form.Label>
            <Form.Control
              type="text"
              as="textarea"
              rows={5}
              placeholder="About You"
              value={form.about}
              onChange={(e) => updateForm({ about: e.target.value })}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a description about yourself.
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Profile Picture</Form.Label>
            <Form.Control
              type="file"
              name="propic"
              onChange={(e) => updateForm({ photo: e.target.files[0] })}
            />
          </Form.Group>
        </Row>
        <Form.Group className="mb-3 mt-2">
          <Form.Check
            required
            label="Agree to terms and conditions"
            feedback="You must agree before submitting."
            feedbackType="invalid"
          />
        </Form.Group>
        <div className="text-center mb-2">
          <Button type="submit" className="w-50">
            Register
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default Register;
