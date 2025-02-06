import React, { useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { useTimeSlots } from "@/hooks/useTimeSlots";
import {
  fetchAvailabilityData,
  saveAvailabilityData,
} from "@/utils/availabilityUtils";
import DayButton from "@/components/DayButton";
import TimeSlot from "@/components/TimeSlot";
import SaveButton from "@/components/SaveButton";
import { GetServerSideProps } from "next";
import { DAYS } from "@/constants/week";

const WeeklySchedule: React.FC<{
  availability: any;
  user_id: string;
  error: string | null;
}> = ({ availability, user_id, error }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(error);

  const {
    selectedDays,
    timeSlots,
    toggleDay,
    handleTimeChange,
    addTimeSlot,
    removeTimeSlot,
  } = useTimeSlots(availability);

  const saveAvailability = async () => {
    const hasAvailability = Object.values(timeSlots).some((slots) =>
      slots.some((slot) => slot.from && slot.to)
    );

    if (!hasAvailability) {
      setErrorMessage("No availability to save!");
      return;
    }

    const availabilityData = { userId: user_id, timeSlots, selectedDays };
    try {
      const result = await saveAvailabilityData(availabilityData);
      if (result?.message) {
        alert(result.message);
      } else {
        setErrorMessage("Failed to save availability.");
      }
    } catch (error) {
      console.error("Error saving availability:", error);
      setErrorMessage(
        "An error occurred while saving availability. Please try again later."
      );
    }
  };

  const isSaveVisible = Object.values(timeSlots).some((slots) =>
    slots.some((slot) => slot.from && slot.to)
  );

  if (errorMessage) {
    return (
      <Box sx={{ width: "100%", padding: 2 }}>
        <Typography variant="h6" color="error" align="center">
          {errorMessage}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", padding: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 1,
            }}
          >
            {DAYS.map(({ label, name }) => (
              <DayButton
                key={name}
                label={label}
                name={name}
                isSelected={selectedDays.includes(name)}
                toggleDay={toggleDay}
              />
            ))}
          </Box>
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const userId = context.query.user_id;

  if (!userId || typeof userId !== "string") {
    return {
      props: { availability: null, user_id: "", error: "Invalid user ID" },
    };
  }

  try {
    const data = await fetchAvailabilityData(userId);
    return { props: { availability: data, user_id: userId, error: null } };
  } catch (error) {
    console.error("Error fetching availability data:", error);
    return {
      props: {
        availability: null,
        user_id: userId,
        error:
          error instanceof Error
            ? error.message
            : "An error occurred while fetching availability data.",
      },
    };
  }
};
