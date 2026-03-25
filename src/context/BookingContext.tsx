import { createContext, useContext, useState, type ReactNode } from 'react';
import type { BookingFormData } from '../types/booking';

type BookingContextType = {
  formData: BookingFormData;
  setFormData: React.Dispatch<React.SetStateAction<BookingFormData>>;
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [formData, setFormData] = useState<BookingFormData>({
    customer_name: "",
    phone_number: "",
    brand_id: null,
    car_model: "",
    car_color: "",
    car_year: "",
    car_plate: "",
    reason: "",
    service: "",
    booking_dt: "",
    booking_hr: ""
  });

  return (
    <BookingContext.Provider value={{ formData, setFormData }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBookingContext() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBookingContext must be used within a BookingProvider");
  }
  return context;
}
