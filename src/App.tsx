import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BookingProvider } from './context/BookingContext';
import { ClientStep } from './pages/ClientStep';
import { CarStep } from './pages/CarStep';
import { BookingStep } from './pages/BookingStep';

function App() {
  return (
    <BookingProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ClientStep />} />
          <Route path="/car" element={<CarStep />} />
          <Route path="/booking" element={<BookingStep />} />
        </Routes>
      </Router>
    </BookingProvider>
  );
}

export default App;
