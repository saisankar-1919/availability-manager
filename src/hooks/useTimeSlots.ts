import { useState, useCallback } from "react";
import { incrementTimeBy30Minutes } from "@/utils/availabilityUtils";

export const useTimeSlots = (initialAvailability: any) => {
  const [selectedDays, setSelectedDays] = useState<string[]>(
    initialAvailability?.selectedDays || []
  );
  const [timeSlots, setTimeSlots] = useState<
    Record<string, { from: string; to: string }[]>
  >(initialAvailability?.timeSlots || {});

  const toggleDay = useCallback((day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
    setTimeSlots((prev) =>
      prev[day] ? prev : { ...prev, [day]: [{ from: "00:00", to: "00:30" }] }
    );
  }, []);

  const handleTimeChange = useCallback(
    (day: string, index: number, field: "from" | "to", value: string) => {
      setTimeSlots((prev) => {
        const updatedSlots = [...prev[day]];
        updatedSlots[index] = {
          ...updatedSlots[index],
          [field]: value,
          ...(field === "from" && { to: incrementTimeBy30Minutes(value) }),
        };
        return { ...prev, [day]: updatedSlots };
      });
    },
    []
  );

  const addTimeSlot = (day: string) => {
    setTimeSlots((prev) => ({
      ...prev,
      [day]: [
        ...prev[day],
        { from: "00:00", to: incrementTimeBy30Minutes("00:00") },
      ],
    }));
  };

  const removeTimeSlot = (day: string, index: number) => {
    setTimeSlots((prev) => {
      const updatedSlots = prev[day].filter((_, i) => i !== index);
      return {
        ...prev,
        [day]: updatedSlots.length
          ? updatedSlots
          : [{ from: "00:00", to: "00:30" }],
      };
    });
  };

  return {
    selectedDays,
    timeSlots,
    toggleDay,
    handleTimeChange,
    addTimeSlot,
    removeTimeSlot,
  };
};
