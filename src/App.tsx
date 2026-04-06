import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BookingProvider } from './context/BookingContext';
import { ClientStep } from './pages/ClientStep';
import { CarStep } from './pages/CarStep';
import { BookingStep } from './pages/BookingStep';
import { ManagerLogin } from './pages/management/ManagerLogin';
import { ManagerRoute } from './Components/ManagerRoute';
import { CalendarPage } from './pages/management/CalendarPage';
import { BookingListPage } from './pages/management/BookingListPage';

function App() {
  return (
    <BookingProvider>
      <Router>
        <Routes>
          {/* Public booking flow (shares BookingProvider state) */}
          <Route path="/" element={<ClientStep />} />
          <Route path="/car" element={<CarStep />} />
          <Route path="/booking" element={<BookingStep />} />

          {/* Manager authentication */}
          <Route path="/admin" element={<ManagerLogin />} />

          {/* Protected manager routes */}
          <Route
            path="/manager/calendar"
            element={
              <ManagerRoute>
                <CalendarPage />
              </ManagerRoute>
            }
          />
          <Route
            path="/manager/bookings/:date"
            element={
              <ManagerRoute>
                <BookingListPage />
              </ManagerRoute>
            }
          />
        </Routes>
      </Router>
    </BookingProvider>
  );
}

export default App;
