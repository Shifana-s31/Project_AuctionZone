import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Search({ searchKeyword }) {
  const [searchResult, setSearchResult] = useState([]);

  async function getSeachResult() {
    const searchJson = { searchKeyword: searchKeyword };
    console.log("fe : - :", searchJson);
    const result = await fetch("http://localhost:5000/auction/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(searchJson),
    })
      .catch((error) => {
        window.alert(error);
        return;
      })
      .then((result) => result.json());
    setSearchResult(result);
    console.log(searchResult, ":resu");
  }

  useEffect(() => {
    getSeachResult();
    return;
  }, [searchResult.length, searchKeyword]);

  return (
    <div className="ms-5 me-5 mt-3">
      <h3 className="mb-4 text-center">
        {searchResult.length} results found for {searchKeyword}
      </h3>

      <Form className="mb-1 text-center">
        <Form.Check
          inline
          type="switch"
          id="custom-switch1"
          label="Active auctions"
          checked
        />
        <Form.Check
          inline
          type="switch"
          id="custom-switch2"
          label="Upcoming auctions"
        />
        <Form.Check
          inline
          type="switch"
          id="custom-switch3"
          label="Ended Auctions"
        />
      </Form>
      {searchResult.map((auction) => {
        return (
          <Link
            to={`/view-auction?id=${auction._id}`}
            style={{ textDecoration: "none", color: "black" }}
          >
            <Card className="mb-2" key={auction._id}>
              <Card.Header as="h5">{auction.name}</Card.Header>
              <Card.Body>
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div className="text-start w-25">
                    <Card.Img
                      variant="top"
                      src={`http://localhost:5000/uploads/${auction.images[0]}`}
                    />
                  </div>
                  <div className="ms-3">
                    <Card.Text>{auction.description}</Card.Text>
                    <Button variant="secondary" className="mb-1">
                      Ends on : {auction.endDate}
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

export default Search;
