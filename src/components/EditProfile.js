import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import Cookies from "universal-cookie";
import formData from "form-data";
import Button from "react-bootstrap/Button";
import AlertBox from "./AlertBox";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import "./Login.css";

function EditProfile() {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("id"); // user id on url
  const [validated, setValidated] = useState(false);
  const [user, setUser] = useState([]);
  const [errorString, setErrorString] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
    city: "",
    state: "",
    zip: "",
    about: "",
    photo: "",
  });

  //   get profile details
  async function getUser() {
    const response = await fetch(`http://localhost:5000/user/${userId}`);

    if (!response.ok) {
      const message = `An error occurred: ${response.statusText}`;
      window.alert(message);
      return;
    }

    const user = await response.json();
    setUser(user);
    setForm({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        city: user.city,
        state: user.state,
        zip: user.zip,
        about: user.about,
        photo: "",
      })
  }

  // scroll to top on render and change in errorString
  useEffect(() => {
    window.scrollTo(0, 0);
    getUser();
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
    // if (form.password != form.confirmPassword) {
    //   errStr += "Password and Confirm Password must be same..!\n";
    //   setErrorString(errStr);
    //   setShowAlert(true);
    //   passwordMatch = false;
    // }
    

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
      console.log("Hey",userId);
      const result = await fetch(`http://localhost:5000/editProfile/${userId}`, {
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
        window.alert("Account updated Successfully !");
        setForm({
          firstName: "",
          lastName: "",
          phone: "",
          city: "",
          state: "",
          zip: "",
          about: "",
        });
        console.log("reg :: ", result._id);
        navigate(`/profile?id=${userId}`);
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
      <h2 className="mb-5 text-center">EDIT PROFILE</h2>
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
        
        <div className="text-center mb-2">
          <Button type="submit" className="w-50">
            Update Profile
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default EditProfile;
