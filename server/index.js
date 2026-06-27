require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
}

app.use(cors());
app.use(express.json());

// Weather Data Schema
const weatherSchema = new mongoose.Schema({
  city: String,
  country: String,
  temperature: Number,
  description: String,
  icon: String,
});

const WeatherData = mongoose.model('WeatherData', weatherSchema);

// Save Weather Data Route
app.post('/api/weather', async (req, res) => {
  try {
    const { city, country, temperature, description, icon } = req.body;

    const weatherData = new WeatherData({
      city,
      country,
      temperature,
      description,
      icon,
    });

    await weatherData.save();

    res.status(201).json({
      success: true,
      message: 'Weather data saved successfully',
    });
  } catch (error) {
    console.error('Error saving weather data:', error);

    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
});

// Start Server Only After DB Connection
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});