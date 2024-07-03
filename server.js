const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;


app.get('/api/hello', async (req, res) => {
    const visitorName = req.query.visitor_name || 'Visitor';
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    try {
        const ipstackApiKey = 'afbfadf90baf6ba001d0e4573b7316ba';
        const ipstackResponse = await axios.get(`http://api.ipstack.com/${clientIp}?access_key=${ipstackApiKey}`);
        const location = ipstackResponse.data.city || 'your location';

        const openWeatherMapApiKey = 'b2bb16232a3c1c64ac8a1ab7604f3a4c';
        const openWeatherMapResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${openWeatherMapApiKey}`);
        const temperature = openWeatherMapResponse.data.main.temp;

        res.json({
            client_ip: clientIp,
            location: location,
            greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${location}`
        });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
