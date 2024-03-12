import { Alert, Button, Snackbar } from "@mui/material";
import { green } from "@mui/material/colors";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { currentUser, register } from "../../Redux/Auth/Action";
// import { store } from "../../Redux/store";

const Signup = () => {
  const [inputData, setInputData] = useState({
    full_name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const {auth} = useSelector(store=>store);
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("handle submit ", inputData);
    dispatch(register(inputData));
    setOpenSnackbar(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputData((values)=>({...values,[name]:value}));
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    if(token) {
      dispatch(currentUser(token))
    }
  },[token])

  useEffect(() => {
    if(auth.reqUser?.full_name) {
      navigate("/home");
    }
  },[auth.reqUser]);

  return (
    <div>
      <div>
        <div className="flex flex-col justify-center items-center min-h-screen">
          <div className="w-[30%] p-10 shadow-md bg-white">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <p className="mb-2">User Name</p>
                <input
                  className="py-2 px-3 outline outline-[#00b0f0] w-full rounded-md border-1"
                  type="text"
                  placeholder="Enter username"
                  name="full_name"
                  onChange={(e) => handleChange(e)}
                  value={inputData.full_name}
                />
              </div>

              <div>
                <p className="mb-2">Email</p>
                <input
                  className="py-2 px-3 outline outline-[#00b0f0] w-full rounded-md border-1"
                  type="text"
                  placeholder="Enter your email"
                  name="email"
                  onChange={(e) => handleChange(e)}
                  value={inputData.email}
                />
              </div>

              <div>
                <p className="mb-2">Password</p>
                <input
                  className="py-2 px-3 outline outline-[#00b0f0] w-full rounded-md border-1"
                  type="text"
                  placeholder="Enter your password"
                  name="password"
                  onChange={(e) => handleChange(e)}
                  value={inputData.password}
                />
              </div>

              <div>
                <Button
                  type="submit"
                  sx={{ bgcolor: "#00b0fa", padding: "0.5rem 0rem" }}
                  variant="contained"
                  className="w-full"
                >
                  Sign up
                </Button>
              </div>
            </form>
            <div className="flex space-x-3 items-center mt-5">
              <p className="m-0">Already have account?</p>
              <Button variant="text" onClick={() => navigate("/signin")}>
                Login
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
            Your account is successfully created!
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default Signup;
