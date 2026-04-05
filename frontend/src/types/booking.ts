// src/types/booking.ts

export interface Booking {
  booking_id: number;
  details_id: number;
  reason: string;
  service: string;
  car_plate: string;    
  booking_dt: string;
  booking_hr: string;
}

export type BookingFormData = {
  //ClientStep
  customer_name: string;
  phone_number: string;
  //CarStep
  brand_id: number | "" | null;
  car_model: string;
  car_color: string;
  car_year: number | "" | null;
  car_plate: string;
  //BookingStep
  reason: string;
  service: string;
  booking_dt: string;
  booking_hr: string;
}
