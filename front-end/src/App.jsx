import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import BookingPage from "./pages/booking"

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/booking" element={<BookingPage />} />
      </Routes>
    </Router>
  )
}

export default App
