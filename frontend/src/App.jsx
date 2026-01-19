
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPw from './pages/ForgotPw';


function App(){
  return (
    <Router>
      <Toaster/>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/forgotpw" element={<ForgotPw/>}/>
      </Routes>
    </Router>
  )
}
export default App


