import express from "express";
import axios from "axios";

const app = express();
const PORT = 3000 || process.env.PORT;

// GET route for user query
app.get("/api/hello", async (req, res) => {
  const visitorName = req.query.visitor_name;
  const clientIp = req.ip;

  // fetch user location using ipapi
  try {
    const fetchData = await axios.get(`https://ipapi.co/${clientIp}/json/`);
    const location = fetchData.data;
    //console.log(location);

    res.status(200).json({
      clientIp,
      location: location || "Unknown location",
      greeting: `Hello, ${visitorName}!`,
    });
  } catch (err) {
    console.error("Error occurred:", err)
    res.status(500).json({error: "Couldn't retrieve location"})
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
