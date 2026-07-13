import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import BookingsPage from './components/finance/bookings/BookingsPage'
import BookingCalendar from './components/finance/bookings/BookingCalendar'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/finance/bookings" replace />} />
        <Route path="/finance/bookings" element={<BookingsPage />} />
        <Route path="/finance/bookings/calendar" element={<BookingCalendar />} />
        <Route path="*" element={<Navigate to="/finance/bookings" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
