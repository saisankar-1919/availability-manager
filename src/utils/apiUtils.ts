export const validateAvailabilityPayload = (
  userId: string,
  timeSlots: any,
  selectedDays: string[]
) => {
  if (!userId || !timeSlots || !selectedDays) {
    throw new Error("Invalid request data");
  }
};
