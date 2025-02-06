// components/SaveButton.tsx
import React from "react";
import { Button, Grid } from "@mui/material";

interface SaveButtonProps {
  isSaveVisible: boolean;
  saveAvailability: () => void;
}

const SaveButton: React.FC<SaveButtonProps> = ({
  isSaveVisible,
  saveAvailability,
}) => {
  return (
    isSaveVisible && (
      <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={saveAvailability}
          sx={{ marginTop: 2 }}
        >
          Save
        </Button>
      </Grid>
    )
  );
};

export default SaveButton;
