import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import { Home } from './pages/Home'
import { UsersPage } from './pages/UsersPage'
import { LoginUser } from './pages/LoginUser'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginUser />} />
          <Route 
            path="/users" 
            element={
              <ProtectedRoute>
                <UsersPage />
              </ProtectedRoute>
            } 
          />
        </Routes>

        <div className="ticks"></div>
      </Router>
    </AuthProvider>
  )
}

export default App
