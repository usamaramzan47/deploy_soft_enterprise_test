import { React } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Products from './pages/Products';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from './context/Auth'
import { Navigate } from 'react-router-dom';
function App() {

  const { user } = useUser();


  const ProtectedRoute = ({ children }) => {
    if (!user?.token) return <Navigate to="/login" />;
    return children;
  };
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/login" element={<Login />} />
        </Routes>
        <ProtectedRoute>
          <Routes>
            <Route path="/products" element={<Products />} />
          </Routes>
        </ProtectedRoute>

      </Router>
      <ToastContainer />
    </div>
  );
}

export default App;
