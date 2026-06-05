import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import { Home } from './pages/Home'
import { UsersPage } from './pages/UsersPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<UsersPage />} />
      </Routes>

      <div className="ticks"></div>
    </Router>
  )
}

export default App
