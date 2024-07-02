import express from "express";
import axios from "axios";
import "dotenv/config.js";

const app = express();

const PORT = 3000;
const apiKey = process.env.API_KEY;

app.set("trust proxy", true);

// GET route for user query
app.get("/api/hello", async (req, res) => {
  const visitorName = req.query.visitor_name || "Guest";
  const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  // Fetch temperature using weather api
  try {
    const fetchData = await axios.get(
      `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${clientIp}`
    );
    const temperature = Math.round(fetchData.data.current.temp_c);
    const location = fetchData.data.location.name;
    console.log(fetchData.data);

    res.status(200).json({
      client_ip: clientIp,
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
