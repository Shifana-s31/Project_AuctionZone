import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Slider from "./Slider";
import List from "./List";
import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Cookies from "universal-cookie";
import AlertBox from "./AlertBox";
import Loading from "./Loading";
import moment from "moment";
import "./ViewAuction.css";

function ViewAuction() {
  const [modalShow, setModalShow] = useState(false);
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [auction, setAuction] = useState("");
  const [images, setImages] = useState([]);
  const [bidderList, setBidderList] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [variant, setVariant] = useState("danger");
  const [amount, setAmount] = useState(0);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const auctionId = searchParams.get("id");
  const cookies = new Cookies();
  const token = cookies.get("TOKEN");
  const userId = cookies.get("USERID");
  const userName = cookies.get("USERNAME");
  const navigate = useNavigate();

  const getAuction = async () => {
    const response = await fetch(`http://localhost:5000/auction/${auctionId}`);
    if (!response.ok) {
      setErrMsg(`An error occurred: ${response.statusText}`);
      setShowAlert(true);
      return;
    }
    const auction = await response.json();
    setAuction(auction);
    setLoading(false);
    setImages(auction.images);
  };

  const getBids = async () => {
    const response = await fetch(`http://localhost:5000/bids/${auctionId}`);
    if (!response.ok) {
      setErrMsg(`An error occurred: ${response.statusText}`);
      setShowAlert(true);
      return;
    }
    const bids = await response.json();
    setBidderList(bids);
  };

  useEffect(() => {
    getAuction();
    const interval = setInterval(() => {
      getAuction();
      getBids();
    }, 1000);
    return () => clearInterval(interval);
  }, [auction.length, bidderList.length]);

  const handleProceedToPayment = () => {
    if (amount <= 0) {
      alert("Please enter a valid bid amount.");
      return;
    }

    const paymentUrl = `/payment?auctionId=${auctionId}&amount=${amount}&userId=${userId}&userName=${userName}`;
    window.open(paymentUrl, "_blank");
  };

  const handleSubmitBid = async () => {
    // if (!paymentCompleted) {
    //   alert("Please complete the payment before submitting the bid.");
    //   return;
    // }
    const bidData = {
      auctionId,
      amount,
      userId,
      userName,
    };
    const result = await fetch("http://localhost:5000/bid/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bidData),
    }).then((response) => response.json());

    if (result.success) {
      setErrMsg("Bid added successfully!");
      setVariant("success");
      setShowAlert(true);
      setModalShow(false);
    } else {
      setErrMsg(result.message);
      setVariant("danger");
      setShowAlert(true);
    }
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="mt-1 SliderDiv">
      <Slider images={images} />
      <AlertBox variant={variant} message={errMsg} showAlert={showAlert} />
      <div className="mt-2 mb-2 text-center">
        {auction.active && (
          <Button variant="primary" onClick={() => setModalShow(true)}>
            Add Bid
          </Button>
        )}
        {!auction.active && (
          <>
            <AlertBox
              variant="dark"
              message="The auction is not active now"
              showAlert={!auction.active}
            />
            <AlertBox
              variant="dark"
              message={`Start Date : ${moment(auction.startDate).format(
                "LL"
              )} ${auction.startTime} || End Date : ${moment(
                auction.endDate
              ).format("LL")} ${auction.endTime}`}
              showAlert={!auction.active}
            />
          </>
        )}
      </div>

      <Modal show={modalShow} onHide={() => setModalShow(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Bid</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Enter amount</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter the amount"
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleProceedToPayment} disabled={paymentCompleted}>
            {paymentCompleted ? "Payment Completed" : "Proceed to Payment"}
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmitBid}
          >
            Submit Bid
          </Button>
          <Button variant="danger" onClick={() => setModalShow(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <List bidderList={bidderList} />
      <div className="mt-3 mb-3">
        <Accordion defaultActiveKey="0" flush>
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <h4>{auction.name}</h4>
            </Accordion.Header>
            <Accordion.Body style={{ whiteSpace: "pre-wrap" }}>
              {auction.description}
              {`\n\nCity : ${auction.city}`}
              {`\n\nStart Date : ${auction.startDate} ${auction.startTime}`}
              {`\nEnd Date : ${auction.endDate} ${auction.endTime}`}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </div>
  );
}

export default ViewAuction;
