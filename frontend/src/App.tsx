import CustomerHome from './features/customer/home'
import AuthPage from './features/auth/authpage'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/customerhome" element={<CustomerHome />} />
    </Routes>
  )
}

export default App
