export type TimeSlot = {
  from: string;
  to: string;
};

export type TimeSlotsByDay = {
  [day: string]: TimeSlot[];
};

export type Availability = {
  timeSlots: TimeSlotsByDay;
  selectedDays: string[];
};

export type AvailabilityResponse = {
  availability: Availability;
};
