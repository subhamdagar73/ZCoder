import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Signin } from "./pages/signin-page";
import { Signup } from "./pages/signup-page";
import { Logout } from "./pages/logout";
import Homepage from "./pages/homepage/App";
import Profilepage from "./pages/profilepage/App";

function App() {
  return <>
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Signin/>} />
            <Route path="/signin" element={<Signin/>} />
            <Route path="/signup" element={<Signup/>} />
            <Route path="/homepage" element={<Homepage/>} />
            <Route path="/logout" element={<Logout/>} />
            <Route path="/profilepage" element={<Profilepage/>} />
        </Routes>
    </BrowserRouter>
  </>;
}

export default App;