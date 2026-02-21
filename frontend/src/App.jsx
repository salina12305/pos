
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage';
import About from './pages/About';
// import Login from './pages/Login';
// import Register from './pages/Register';
import ForgotPw from './pages/ForgotPw';
import FeedPage from './pages/FeedPage';
import CreatePostPage from './pages/CreatePostPage';
import ProfilePage from './pages/ProfilePage';


function App(){
  return (
    <Router>
      <Toaster/>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/forgotpw" element={<ForgotPw/>}/>
        <Route path="/feedpage" element={<FeedPage/>}/>
        <Route path="/create-post" element={<CreatePostPage/>}/>
        <Route path="/profile" element={<ProfilePage/>}/>
      </Routes>
    </Router>
  )
}
export default App


