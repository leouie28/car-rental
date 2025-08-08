import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import BookingPage from "./pages/booking"
import HomePage from "./pages/home"
import ClientLayout from "./layout/client";
import AdminLayout from "./layout/admin";
import TrackPage from "./pages/admin/track";
import AdminDashboardPage from "./pages/admin/dashboard";
import AdminCarsPage from "./pages/admin/cars";
import AdminCarForm from "./pages/admin/cars/form";
import AdminLogin from "./pages/admin/login";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<ClientLayout />} >
          <Route index element={<HomePage />} />
          <Route path="booking" element={<BookingPage />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="cars">
            <Route index element={<AdminCarsPage />} />
            <Route path="create" element={<AdminCarForm />} />
            <Route path=":id/edit" element={<AdminCarForm />} />
          </Route>
          <Route path="track" element={<TrackPage />} />
        </Route>
        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>
    </Router>
  )
}

export default App
