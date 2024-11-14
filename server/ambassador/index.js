const express = require('express');
const AmbassadorService = require('./AmbassadorService');
const app = express();

const PORT = 8080;

const ambassador = new AmbassadorService()

// endpoint để các container khác gọi đến
app.get('/fetchData', async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) {
            return res.status(400).send("URL parameter is required");
        }

        ambassador.setUrl(url);  // Đặt URL cho ambassador

        // Fetch dữ liệu từ URL
        // console.log("Trước khi gọi fetchData");
        let response = await ambassador.fetchData();
        // console.log("Sau khi gọi fetchData:", response);

        // Kiểm tra kiểu dữ liệu trả về
        if (typeof response === 'string') {
            // Nếu dữ liệu trả về là chuỗi (string), kiểm tra là JSON hay XML
            const isJson = response.trim().startsWith('{') || response.trim().startsWith('[');

            if (isJson) {
                // Nếu trả về là JSON
                try {
                    const jsonData = JSON.parse(response);  // Parse chuỗi JSON
                    res.set('Content-Type', 'application/json');
                    res.send(jsonData);  // Trả về dữ liệu JSON
                } catch (error) {
                    res.status(500).send("Failed to parse JSON data.");
                }
            } else {
                // Nếu trả về là XML
                try {
                    response = response.replace(/<!--[\s\S]*?-->/g, '').trim(); // Loại bỏ comment trong XML
                    res.set('Content-Type', 'application/xml');
                    res.send(response);  // Trả về dữ liệu XML
                } catch (error) {
                    res.status(500).send("Failed to process XML data.");
                }
            }
        } else if (typeof response === 'object') {
            // Nếu trả về là JSON object (đã parse rồi), không cần trim
            res.set('Content-Type', 'application/json');
            res.send(response);  // Trả về dữ liệu JSON
        } else {
            res.status(500).send("Invalid response data type.");
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(PORT, () => {
    console.log(`AmbassadorService is running on port ${PORT}`);
});
