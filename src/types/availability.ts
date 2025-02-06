// export type TimeSlot = {
//   start: string;
//   end: string;
// };

// export type Availability = {
//   [day: string]: TimeSlot[];
// };

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
