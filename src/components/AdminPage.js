import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import Card from "react-bootstrap/Card";
import "./AdminPage.css"; // Import the custom CSS

function AdminPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Sample user data
    const userData = [
      { firstName: "vinu", lastName: "B", paymentStatus: "Paid" },
      { firstName: "sachin", lastName: "A", paymentStatus: "Pending" },
      { firstName: "Anil", lastName: "S", paymentStatus: "Paid" },
      { firstName: "geethu", lastName: "s", paymentStatus: "Pending" },
      { firstName: "geethu", lastName: "A", paymentStatus: "Paid" },
      { firstName: "Mr", lastName: "Bean", paymentStatus: "Pending" },
      { firstName: "Mr", lastName: "Bean", paymentStatus: "Paid" },
    ];

    // Set the user data state
    setUsers(userData);
  }, []);

  return (
    <div className="admin-page-container">
      <Card className="admin-card">
        <Card.Header as="h2" className="text-center">User Payment Status</Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive className="admin-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td>{`${user.firstName} ${user.lastName}`}</td>
                  <td>{user.paymentStatus}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
}

export default AdminPage;
