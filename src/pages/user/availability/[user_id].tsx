import React, { useState, useEffect, useCallback } from "react";
import { GetServerSideProps } from "next";
import { Box, Grid, Typography } from "@mui/material";
import { toast } from "react-toastify";
import {
  fetchAvailabilityData,
  incrementTimeBy30Minutes,
  saveAvailabilityData,
} from "@/utils/availabilityUtils";
import DayButton from "@/components/DayButton";
import TimeSlot from "@/components/TimeSlot";
import SaveButton from "@/components/SaveButton";
import { useRouter } from "next/router";
import { Availability } from "@/types/availability";

interface AvailabilitySlot {
  from: string;
  to: string;
}

interface WeeklyScheduleProps {
  availability: Availability;
  user_id: string;
}

const days = [
  { label: "S", name: "Sunday" },
  { label: "M", name: "Monday" },
  { label: "T", name: "Tuesday" },
  { label: "W", name: "Wednesday" },
  { label: "Th", name: "Thursday" },
  { label: "F", name: "Friday" },
  { label: "Sa", name: "Saturday" },
];

export const getServerSideProps: GetServerSideProps = async (context) => {
  const userId = context.query.user_id;

  if (!userId || typeof userId !== "string") {
    return {
      props: { availability: null, user_id: "", error: "Invalid user ID" },
    };
  }

  try {
    const data = await fetchAvailabilityData(userId);
    return { props: { availability: data, user_id: userId } };
  } catch (error) {
    return {
      props: {
        availability: null,
        user_id: userId,
        error: error instanceof Error ? error.message : "Unknown error",
      },
    };
  }
};

const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({
  availability,
  user_id,
}) => {
  const [selectedDays, setSelectedDays] = useState<string[]>(
    availability?.selectedDays || []
  );
  const [timeSlots, setTimeSlots] = useState<
    Record<string, { from: string; to: string }[]>
  >(availability?.timeSlots || {});

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

  const saveAvailability = async () => {
    const hasAvailability = Object.values(timeSlots).some((slots) =>
      slots.some((slot) => slot.from && slot.to)
    );

    if (!hasAvailability) {
      alert("No availability to save!");
      return;
    }

    const availabilityData = { userId: user_id, timeSlots, selectedDays };
    const result = await saveAvailabilityData(availabilityData);
    if (result?.message) {
      alert(result.message);
    } else {
      alert("Failed to save availability");
    }
  };

  const isSaveVisible = Object.values(timeSlots).some((slots) =>
    slots.some((slot) => slot.from && slot.to)
  );

  return (
    <Box sx={{ width: "100%", padding: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
          {days.map(({ label, name }) => (
            <DayButton
              key={name}
              label={label}
              name={name}
              isSelected={selectedDays.includes(name)}
              toggleDay={toggleDay}
            />
          ))}
        </Grid>

        <Grid item xs={12}>
          {selectedDays.map((day) => (
            <Box key={day} sx={{ marginTop: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={4}>
                  <Typography variant="h6" align="center">
                    {day}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={8}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    alignItems: "center",
                  }}
                >
                  {timeSlots[day].map((slot, index) => (
                    <TimeSlot
                      key={index}
                      day={day}
                      slot={slot}
                      index={index}
                      handleTimeChange={handleTimeChange}
                      addTimeSlot={addTimeSlot}
                      removeTimeSlot={removeTimeSlot}
                      canRemove={timeSlots[day].length > 1}
                    />
                  ))}
                </Grid>
              </Grid>
            </Box>
          ))}
        </Grid>

        <SaveButton
          isSaveVisible={isSaveVisible}
          saveAvailability={saveAvailability}
        />
      </Grid>
    </Box>
  );
};

export default WeeklySchedule;
