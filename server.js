import express from "express";
import axios from "axios";

const app = express();
const PORT = 3000 || process.env.PORT;

// GET route for user query
app.get("/api/hello", async (req, res) => {
  const visitor_name = req.query.visitor_name;
  const client_ip = req.ip;

  // fetch user location using ipapi
  try {
    const fetchData = await axios.get(`https://ipapi.co/${client_ip}/json/`);
    const location = fetchData.data;
    //console.log(location);

    res.status(200).json({
      client_ip,
      location: location || "Unknown location",
      greeting: `Hello, ${visitor_name}!`,
    });
  } catch (err) {
    console.error("Error occurred:", err)
    res.status(500).json({error: "Couldn't retrieve location"})
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
