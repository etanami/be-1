import express from "express";
import axios from "axios";
import "dotenv/config.js";

const app = express();

const PORT = 3000;
const apiKey = process.env.API_KEY;

// GET route for user query
app.get("/api/hello", async (req, res) => {
  const visitorName = req.query.visitor_name;
  // const clientIp = req.ip;

  // Get precise ip address with ipapi
  let clientIp;
  try {
    const response = await axios.get("https://ipapi.co/json/");
    clientIp = response.data.ip;
  } catch (err) {
    console.error("Error fetching public IP:", err);
    // Fallback to req.ip if API call fails
    clientIp = req.ip;
  }

  // Fetch user location and temperature using weather api
  try {
    const fetchData = await axios.get(
      `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${clientIp}`
    );
    const location = fetchData.data.location.region;
    const temperature = fetchData.data.current.temp_c;
    console.log(fetchData.data);

    res.status(200).json({
      clientIp,
      location: location || "Unknown location",
      greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celcius in ${location}`,
    });
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ error: "Couldn't retrieve location" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
