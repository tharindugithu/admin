import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthGuard from './components/AuthGuard';
import LoginPage from './components/Login';
import HomePage from './components/Dashboard';
import Navbar from './components/Navbar';
import Category from './components/Category';

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for Login page */}
        <Route
          path="/login"
          element={
            <AuthGuard>
              <LoginPage />
            </AuthGuard>
          }
        />

        {/* Routes for authenticated pages with Navbar */}
        <Route
          path="/*"
          element={
            <AuthGuard>
              <div className='flex gap-10'>
                <Navbar />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/category" element={<Category />} />
                  {/* Add more routes as needed */}
                </Routes>
              </div>
            </AuthGuard>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
