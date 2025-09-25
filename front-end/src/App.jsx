import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import BookingPage from "./pages/booking"
import HomePage from "./pages/home"
import ClientLayout from "./layout/client";
import AdminLayout from "./layout/admin";
import TrackPage from "./pages/admin/track";
import AdminCarsPage from "./pages/admin/cars";
import AdminCarForm from "./pages/admin/cars/form";
import AdminLogin from "./pages/admin/login";
import MessagesLayout from "./pages/admin/messages/layout";
import AdminMessages from "./pages/admin/messages";
import AdminMessagesSelected from "./pages/admin/messages/selected";
import BookingCreatePage from "./pages/booking/create";
import AdminBookingsPage from "./pages/admin/bookings";
import AdminDriversPage from "./pages/admin/drivers";
import AdminReportsPage from "./pages/admin/reports";
import AccountPage from "./pages/account";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<ClientLayout />} >
          <Route index element={<HomePage />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="booking">
            <Route index element={<BookingPage />} />
            <Route path="create" element={<BookingCreatePage />} />
          </Route>
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminReportsPage />} />
          <Route path="reports" element={<AdminReportsPage />} />
          <Route path="cars">
            <Route index element={<AdminCarsPage />} />
            <Route path="create" element={<AdminCarForm />} />
            <Route path=":id/edit" element={<AdminCarForm />} />
            <Route path=":id" element={<AdminCarForm />} />
          </Route>
          <Route path="bookings">
            <Route index element={<AdminBookingsPage />} />
          </Route>
          <Route path="track" element={<TrackPage />} />
          <Route path="drivers" element={<AdminDriversPage />} />
          <Route path="messages" element={<MessagesLayout />}>
            <Route index element={<AdminMessages />} />
            <Route path=":id" element={<AdminMessagesSelected />} />
          </Route>
        </Route>
        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>
    </Router>
  )
}

export default App
