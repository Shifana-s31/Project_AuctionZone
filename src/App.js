import { Route, Routes } from "react-router-dom";

// import components
import NaviBar from "./components/NaviBar";
import Home from "./components/Home";
import ViewAuction from "./components/ViewAuction";
import Login from "./components/Login";
import AdminLogin from "./components/AdminLogin";
import Register from "./components/Register";
import RegisterAuction from "./components/RegisterAuction";
import Profile from "./components/Profile";
import Cookies from "universal-cookie";
import Search from "./components/Search";
import { useState } from "react";
import Notification from "./components/Notification";
import EditProfile from "./components/EditProfile";
import PaymentPage from "./components/Payment";
import AdminPage from "./components/AdminPage";
import AuctionZone from "./components/AuctionZone";
import RegisteredUsersPage from "./components/RegisteredUsers";

function App() {
  const cookies = new Cookies();
  const [token, setToken] = useState(cookies.get("TOKEN"));
  const [userName, setUserName] = useState(cookies.get("USERNAME"));
  const [userId, setUserId] = useState(cookies.get("USERID"));
  const [searchKeyword, setSearchKeyword] = useState("");

  return (
    <div className="App">
      <NaviBar
        token={token}
        userName={userName}
        userId={userId}
        setUserName={setUserName}
        setSearchKeyword={setSearchKeyword}
      />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/view-auction/" element={<ViewAuction />} />
        <Route path="/register-auction" element={<RegisterAuction />} />
        <Route path="/register" element={<Register />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/admin" element={<AuctionZone/>} />
        <Route path="/registered-users" element={<RegisteredUsersPage/>} />
        <Route
          path="/search"
          element={<Search searchKeyword={searchKeyword} />}
        />
        <Route
          path="/login"
          element={
            <Login
              setToken={setToken}
              setUserName={setUserName}
              setUserId={setUserId}
            />
          }
        />
        <Route
          path="/adminlogin"
          element={
            <AdminLogin
              setToken={setToken}
              setUserName={setUserName}
              setUserId={setUserId}
            />
          }
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/notifications" element={<Notification />} />
        <Route path="/editprofile" element={<EditProfile />} />
      </Routes>
    </div>
  );
}

export default App;
