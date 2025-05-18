import { Routes, Route } from "react-router-dom";
import Home from './hompage/Home'
import Login from "./auth/Login";
import About from "./hompage/About";
import Register from "./auth/Register";
import Contact from "./hompage/Contact";
import Materials from "./products/material/Material";


function App() {
  return (
    <>
    <div className="w-full min-h-screen bg-[#f3f2f3] z-50">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/contact-us" element= {<Contact />} />
        <Route path="/products/materials" element={<Materials />} />
      </Routes>
    </div>
    </>
  )
}

export default App
