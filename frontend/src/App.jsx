import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage';
import About from './pages/About';
import ForgotPw from './pages/ForgotPw';
import FeedPage from './pages/FeedPage';
import CreatePostPage from './pages/CreatePostPage';
import ProfilePage from './pages/ProfilePage';
import EditPost from './pages/EditPost';

function App() {
  return (
    <Router>
      {/* This is the 'stage' where all your toasts will perform */}
      <Toaster 
        position="top-center" 
        reverseOrder={false}
        toastOptions={{
          style: {
            borderRadius: '15px',
            background: '#333',
            color: '#fff',
            padding: '16px',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/forgotpw" element={<ForgotPw />} />
        <Route path="/feedpage" element={<FeedPage />} />
        <Route path="/create-post" element={<CreatePostPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/edit-post/:id" element={<EditPost />} />
      </Routes>
    </Router>
  );
}

export default App;