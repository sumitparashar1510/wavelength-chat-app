import { Alert, Button, Snackbar } from "@mui/material";
import { green } from "@mui/material/colors";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { currentUser, login } from "../../Redux/Auth/Action";

const Signin = () => {
  const [inputData, setInputData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const dispatch = useDispatch();
  const {auth} = useSelector(store=>store);
  const token = localStorage.getItem("token");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("handle submit");
    setOpenSnackbar(true);
    dispatch(login(inputData));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputData((values) => ({ ...values, [name]: value }));
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    if (token) {
      dispatch(currentUser(token));
    }
  }, [token]);

  useEffect(() => {
    if (auth.reqUser?.full_name) {
      navigate("/home");
    }
  }, [auth.reqUser]);

  return (
    <div>
      <div className="flex justify-center h-screen items-center">
        <div className="w-[30%] p-10 shadow-md bg-white">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <p className="mb-2">Email</p>
              <input
                placeholder="Enter your email"
                value={inputData.email}
                onChange={(e) => handleChange(e)}
                type="text"
                name="email"
                className="py-2 px-3 outline outline-[#00b0f0] w-full rounded-md border "
              />
            </div>

            <div>
              <p className="mb-2">Password</p>
              <input
                placeholder="Enter your password"
                value={inputData.password}
                onChange={(e) => handleChange(e)}
                type="text"
                name="password"
                className="py-2 px-3 outline outline-[#00b0f0] w-full rounded-md border "
              />
            </div>

            <div>
              <Button
                type="submit"
                sx={{ bgcolor: "#00b0fa", padding: "0.5rem 0rem" }}
                variant="contained"
                className="w-full"
              >
                Sign in
              </Button>
            </div>
          </form>
          <div className="flex space-x-3 items-center mt-5">
            <p className="m-0">Create New Account</p>
            <Button variant="text" onClick={() => navigate("/signup")}>
              signup
            </Button>
          </div>
        </div>
      </div>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          You've logged in successfully!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Signin;
