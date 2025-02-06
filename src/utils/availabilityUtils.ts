// utils.ts
export const incrementTimeBy30Minutes = (time: string): string => {
  const [hours, minutes] = time.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes + 30;
  const newHours = Math.floor(totalMinutes / 60);
  const newMinutes = totalMinutes % 60;
  return `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(
    2,
    "0"
  )}`;
};

export const fetchAvailabilityData = async (userId: string | string[]) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/availability?userId=${userId}`
    );
    const data = await response.json();
    return response.ok ? data : null;
  } catch (error) {
    console.error("Error fetching availability:", error);
    return null;
  }
};

export const saveAvailabilityData = async (availabilityData: any) => {
  try {
    const response = await fetch("/api/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(availabilityData),
    });
    return await response.json();
  } catch (error) {
    console.error("Error saving availability:", error);
    return null;
  }
};
