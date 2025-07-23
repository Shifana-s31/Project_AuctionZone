import React, { useState } from "react";
import FormData from "form-data";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import AlertBox from "./AlertBox";
import Cookies from "universal-cookie";
import "./Login.css";

function CreateAuction() {
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState("");
  const cookies = new Cookies();
  const token = cookies.get("TOKEN");
  const userId = cookies.get("USERID");
  const [form, setForm] = useState({
    name: "",
    description: "",
    city: "",
    state: "",
    zip: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    minimumBid: "",
    imageObject: "",
    images: "",
    userId: userId,
  });
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }
  async function handleSubmit(event) {
    console.log(form);
    const bootform = event.currentTarget;
    event.preventDefault();
    if (bootform.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    const aucForm = { ...form };

    const newAuc = new FormData();
    for (var key in aucForm) {
      newAuc.append(key, aucForm[key]);
    }
    const files = aucForm.imageObject;
    if (files.length != 0) {
      for (const single_file of files) {
        newAuc.append("images", single_file);
      }
    }
    const result = await fetch("http://localhost:5000/auction/add", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: newAuc,
    })
      .catch((error) => {
        window.alert(error);
        return;
      })
      .then((result) => result.json());
    if (result.registered) {
      window.alert("Auction Registered Successfully !");
      setForm({
        name: "",
        description: "",
        city: "",
        state: "",
        zip: "",
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        minimumBid: "",
        imageObject: "",
        images: "",
      });
      navigate("/");
    }else{
      // if user not logged in
      console.log("res",result);
      if(!result.login){
        window.alert("Login required to register auction!");
        navigate("/login");
      }
      window.scroll(0,0);
      setMessage(result.message);
      setShowAlert(true);
    }
    setValidated(true);
  }

  return (
    <div className="centered-div">
      <h2 className="mb-5 text-center">REGISTER AUCTION</h2>
      <AlertBox showAlert={showAlert} variant="warning" message={message}/>
      <Form
        noValidate
        validated={validated}
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <Row className="mb-3">
          <Form.Group as={Col} controlId="validationCustom01">
            <Form.Label>Product Name</Form.Label>
            <Form.Control
              required
              type="text"
              onChange={(e) => updateForm({ name: e.target.value })}
              placeholder="Enter the product name"
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row>
          <Form.Group as={Col} className="mb-3" controlId="validationCustom02">
            <Form.Label>Product Description</Form.Label>
            <Form.Control
              type="text"
              as="textarea"
              rows={5}
              onChange={(e) => updateForm({ description: e.target.value })}
              placeholder="Enter details about the product"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide details of the product.
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} md="6" controlId="validationCustom04">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              onChange={(e) => updateForm({ city: e.target.value })}
              placeholder="City"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid city.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="3" controlId="validationCustom05">
            <Form.Label>State</Form.Label>
            <Form.Control
              type="text"
              onChange={(e) => updateForm({ state: e.target.value })}
              placeholder="State"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid state.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="3" controlId="validationCustom06">
            <Form.Label>Zip</Form.Label>
            <Form.Control
              type="text"
              onChange={(e) => updateForm({ zip: e.target.value })}
              placeholder="Zip"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid zip.
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="6" controlId="validationCustom07">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              onChange={(e) => updateForm({ startDate: e.target.value })}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid Start Date.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="6" controlId="validationCustom08">
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="date"
              onChange={(e) => updateForm({ endDate: e.target.value })}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid End Date.
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} md="6" controlId="validationCustom09">
            <Form.Label>Start Time</Form.Label>
            <Form.Control
              type="time"
              onChange={(e) => updateForm({ startTime: e.target.value })}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid Start Time.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="6" controlId="validationCustom10">
            <Form.Label>End Time</Form.Label>
            <Form.Control
              type="time"
              onChange={(e) => updateForm({ endTime: e.target.value })}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid End Time.
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="validationCustomUsername11">
            <Form.Label>Minimum Bid</Form.Label>
            <InputGroup hasValidation>
              <InputGroup.Text id="inputGroupPrepend">₹</InputGroup.Text>
              <Form.Control
                type="number"
                placeholder="Minimum Bid"
                onChange={(e) => updateForm({ minimumBid: e.target.value })}
                aria-describedby="inputGroupPrepend"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter the minimum bid amount.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="validationCustom03">
            <Form.Label>Images of the product</Form.Label>
            <Form.Control
              required
              type="file"
              name="images"
              accept="image/*"
              multiple
              onChange={(e) => updateForm({ imageObject: e.target.files })}
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
        </Row>
        <div className="mt-4 text-center">
          <Button type="submit" className="w-50">
            Add Product for Auction
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default CreateAuction;
