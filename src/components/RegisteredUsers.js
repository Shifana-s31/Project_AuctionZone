import React from "react";
import { Table, Container } from "react-bootstrap";
import "./RegisteredUsersPage.css";

const registeredUsers = [
  {
    "_id": {
      "$oid": "66ee81f5a87810cbc33a1ca5"
    },
    "firstName": "sachin",
    "lastName": "A",
    "phone": "1234567891",
    "email": "sachin@gmail.com",
    "password": "$2b$10$CTY1Crwq2StJJwVLlfo.AOqglxpOgkSPZb/SBB1kElLUPutRRzdeO",
    "city": "calicut",
    "state": "Kerala",
    "zip": "Ernakulam",
    "about": "Am Sachin",
    "photo": "default-profile-picture.jpg",
    "admin": false
  },
  {
    "_id": {
      "$oid": "66ef9574e958a65018a5e27f"
    },
    "firstName": "Anil",
    "lastName": "S",
    "phone": "9746624255",
    "email": "anils2002@gmail.com",
    "password": "$2b$10$M7bgJmhhk59SWcbUk6rulemTWhVHBjvxT5YaYV6yI1Jv2cOrfWzl2",
    "city": "Idukki",
    "state": "Kerala",
    "zip": "695601",
    "about": "Traveller",
    "photo": "default-profile-picture.jpg",
    "admin": false
  },
  {
    "_id": {
      "$oid": "671aeadc729b18c4f29329ae"
    },
    "firstName": "geethu",
    "lastName": "s",
    "phone": "08891347401",
    "email": "geethus003@gmail.com",
    "password": "$2b$10$/mXLbA.tZhQ8.AlWTfzzqug7RcJK5E3oPZyBvFicTGhYjm/87AGu2",
    "city": "Thiruvananthapuram",
    "state": "Kerala",
    "zip": "Ernakulam",
    "about": "Am a student",
    "photo": "default-profile-picture.jpg",
    "admin": false
  },
  {
    "_id": {
      "$oid": "671aeb58729b18c4f29329af"
    },
    "firstName": "geethu",
    "lastName": "A",
    "phone": "1234567899",
    "email": "geethua@gmail.com",
    "password": "$2b$10$InNOtZoRcir73D7HIsBbNOzfZaRNxAXYrYoLsi3x1ZrpsQJSi1Vve",
    "city": "Ernakulam",
    "state": "Kerala",
    "zip": "Ernakulam",
    "about": "Am a student",
    "photo": "default-profile-picture.jpg",
    "admin": false
  },
  {
    "_id": {
      "$oid": "671af708d9cfb56b06f97658"
    },
    "firstName": "Mr",
    "lastName": "Bean",
    "phone": "01234567899",
    "email": "mrbean@gmail.com",
    "password": "$2b$10$Hxd7.rTXX5hN1Zfs.JjaUO7j9odWMcYDduakBjQNK4bK0XMI6rIFa",
    "city": "Ernakulam",
    "state": "Kerala",
    "zip": "Ernakulam",
    "about": "I am from India",
    "photo": "default-profile-picture.jpg",
    "admin": false
  },
  {
    "_id": {
      "$oid": "671b79951c4f9344cc56c2cf"
    },
    "firstName": "Mr",
    "lastName": "Bean",
    "phone": "01234567899",
    "email": "mrbean123@gmail.com",
    "password": "$2b$10$S2ux3RPYvL7TSy3VZQLYj.1OnCXnPC0rDSDQqhUp1te32SzkRNfVu",
    "city": "Ernakulam",
    "state": "Kerala",
    "zip": "Ernakulam",
    "about": "Human",
    "photo": "default-profile-picture.jpg",
    "admin": false
  }
];

function RegisteredUsersPage() {
  return (
    <Container className="registered-users-page">
      <h2 className="text-center page-title">Registered Users</h2>
      <Table striped bordered hover responsive className="user-table mt-4">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>City</th>
            <th>State</th>
            <th>Zip</th>
            <th>About</th>
          </tr>
        </thead>
        <tbody>
          {registeredUsers.map((user) => (
            <tr key={user._id.$oid}>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.phone}</td>
              <td>{user.email}</td>
              <td>{user.city}</td>
              <td>{user.state}</td>
              <td>{user.zip}</td>
              <td>{user.about}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default RegisteredUsersPage;
