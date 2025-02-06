import { NextApiRequest, NextApiResponse } from "next";
import redis from "../../lib/redis";

const saveAvailability = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { userId, timeSlots, selectedDays } = req.body;

    if (!userId || !timeSlots || !selectedDays) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    try {
      await redis.set(
        `availability:${userId}`,
        JSON.stringify({ timeSlots, selectedDays })
      );

      return res
        .status(200)
        .json({ message: "Availability saved successfully!" });
    } catch (error) {
      console.error("Error saving to Redis:", error);
      return res.status(500).json({ message: "Error saving availability" });
    }
  } else if (req.method === "GET") {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    try {
      const availabilityData = await redis.get(`availability:${userId}`);

      if (availabilityData) {
        return res.status(200).json(JSON.parse(availabilityData));
      } else {
        return res.status(404).json({ message: "No availability data found" });
      }
    } catch (error) {
      console.error("Error fetching from Redis:", error);
      return res.status(500).json({ message: "Error fetching availability" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
};

export default saveAvailability;
