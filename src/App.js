import { Route, Routes } from "react-router-dom";
import HomePage from "./Components/HomePage";
import Status from "./Components/Status/Status";
import StatusViewer from "./Components/Status/StatusViewer";
import Signin from "./Components/Register/Signin";
import Signup from "./Components/Register/Signup";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Signin/>}></Route>
        <Route path="/signin" element={<Signin/>}></Route>
        <Route path="/home" element={<HomePage/>}></Route>
        <Route path="/status" element={<Status/>}></Route>
        <Route path="/signup" element={<Signup/>}></Route>
        <Route path="/status/:userId" element={<StatusViewer/>}></Route>
      </Routes>
    </div>
  );
}

export default App;
