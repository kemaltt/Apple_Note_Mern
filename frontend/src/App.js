import CssBaseline from "@mui/material/CssBaseline";
import React, { useState } from "react";
import LoginPage from "./components/pages/Login/LoginPage";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import RegisterPage from "./components/pages/Register/RegisterPage";
import HomePage from "./components/pages/Home/HomePage";
import AuthRequired from "./components/common/AuthRequired";
import PostPage from "./components/pages/Post/PostPage";

function App() {
  const [token, setToken] = useState();
  // const [userId, setUserId] = useState("");

  return (
    <React.Fragment>
      <CssBaseline />
      <BrowserRouter>
        {/* <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes> */}
        <Routes>
          <Route
            path="/"
            element={<Navigate to={token ? "/home/" : "/login"} />}
          />
          <Route path="/login" element={<LoginPage setToken={setToken} />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/home"
            element={
              <AuthRequired token={token}>
                <HomePage token={token} />
              </AuthRequired>
            }
          />
          <Route
            path="/give"
            element={
              <AuthRequired token={token}>
                <PostPage />
              </AuthRequired>
            }
          />
        </Routes>
      </BrowserRouter>
    </React.Fragment>
  );
}

// const ProtectedRoute = (props) => {
//   if(!props.token) {
//     return <Navigate to="/login" />;
//   }
//   return <><Route {...props} /></>
// }

export default App;
