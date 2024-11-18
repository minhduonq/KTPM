//const gpModel = require('../models/fe-rate-model')
const axios = require('axios')
const xml2js = require('xml2js');
const redisClient = require('../redis')

const EXTERNAL_FE_URL = 'https://portal.vietcombank.com.vn/Usercontrols/TVPortal.TyGia/pXML.aspx'
const AMBASSADOR_URL = `http://ambassador:8080/fetchData?url=${EXTERNAL_FE_URL}`

exports.getFERate = async (req, res, next) => {
  const MAX_RETRIES = 5; // Số lần thử tối đa
  const RETRY_DELAY = 10000; // 10 giây

  async function fetchData(retries = 0) {
    try {
      const response = await axios.get(AMBASSADOR_URL);

      if (response && response.status === 200) {
        // Nếu response hợp lệ, parse XML và trả về kết quả
        console.log(`Data fetched successfully at retry=${retries}`)
        const xmlData = response.data;
        xml2js.parseString(xmlData, (err, result) => {
          if (err) {
            console.error("Error parsing XML:", err);
            res.status(500).send("Error while parsing XML");
          } else {
            res.json(result);
          }
        });
      } else {
        // Nếu response là null hoặc lỗi 500, thử lại sau 10 giây
        if (retries < MAX_RETRIES) {
          console.log(`Retrying in ${RETRY_DELAY / 1000} seconds... (${retries + 1}/${MAX_RETRIES})`);
          setTimeout(() => fetchData(retries + 1), RETRY_DELAY);
        } else {
          res.status(500).send("Error: Failed to fetch data after multiple attempts.");
          // Nếu hết retries, lấy dữ liệu từ cache
          // const cachedData = await redisClient.get(CACHE_KEY);
          // if (cachedData) {
          //   console.log("Returning cached data due to API failure.");
          //   res.json(JSON.parse(cachedData));
          // } else {
          //   res.status(500).send("Error: Failed to fetch data after multiple attempts and no cached data available.");
          // }
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 500 && retries < MAX_RETRIES) {
        console.log(`Error 500: Retrying in ${RETRY_DELAY / 1000} seconds... (${retries + 1}/${MAX_RETRIES})`);
        setTimeout(() => fetchData(retries + 1), RETRY_DELAY);
      } else {
        console.error("Error fetching API:", error);
        res.status(500).send("Error fetching data from Vietcombank API");
      }
    }
  }

  fetchData();
};

exports.loadMainPage = (req, res, next) => {
    res.send('This is FE Rate server!')
};