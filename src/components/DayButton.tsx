import React from "react";
import { Button } from "@mui/material";

interface DayButtonProps {
  label: string;
  name: string;
  isSelected: boolean;
  toggleDay: (day: string) => void;
}

const DayButton: React.FC<DayButtonProps> = ({
  label,
  name,
  isSelected,
  toggleDay,
}) => (
  <Button
    variant={isSelected ? "contained" : "outlined"}
    onClick={() => toggleDay(name)}
    sx={{
      margin: 0.5,
      padding: 2.5,
      borderRadius: "50px",
    }}
  >
    {label}
  </Button>
);

export default DayButton;
