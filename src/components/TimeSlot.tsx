import React from "react";
import { TextField, IconButton, Box } from "@mui/material";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";

interface TimeSlotProps {
  day: string;
  slot: { from: string; to: string };
  index: number;
  handleTimeChange: (
    day: string,
    index: number,
    field: "from" | "to",
    value: string
  ) => void;
  addTimeSlot: (day: string) => void;
  removeTimeSlot: (day: string, index: number) => void;
  canRemove: boolean;
}

const TimeSlot: React.FC<TimeSlotProps> = ({
  day,
  slot,
  index,
  handleTimeChange,
  addTimeSlot,
  removeTimeSlot,
  canRemove,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
        marginTop: 1,
      }}
    >
      <Box>
        <TextField
          type="time"
          value={slot.from}
          onChange={(e) => handleTimeChange(day, index, "from", e.target.value)}
          size="small"
        />
        <TextField
          type="time"
          value={slot.to}
          onChange={(e) => handleTimeChange(day, index, "to", e.target.value)}
          size="small"
        />
      </Box>

      <div
        style={{
          display: "flex",
          gap: 5,
          width: "50px",
          justifyContent: "space-between",
        }}
      >
        <IconButton onClick={() => addTimeSlot(day)}>
          <AddCircleOutline />
        </IconButton>
        {canRemove && (
          <IconButton onClick={() => removeTimeSlot(day, index)}>
            <RemoveCircleOutline />
          </IconButton>
        )}
      </div>
    </Box>
  );
};

export default TimeSlot;
