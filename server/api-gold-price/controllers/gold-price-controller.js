const gpModel = require('../models/goldPriceModel')
const axios = require('axios')
const {exec} = require('child_process');
/*
exports.setGoldPrice = (req,res,next) => {
    const {goldPrice} = req.body;
    gpModel.addGoldPrice(1,goldPrice);
}
*/

const EXTERNAL_GOLD_URL = 'https://sjc.com.vn/GoldPrice/Services/PriceService.ashx'
const AMBASSADOR_URL = `http://ambassador:8080/fetchData?url=${EXTERNAL_GOLD_URL}`

exports.getGoldPrice = async (req, res, next) => {
    const MAX_RETRIES = 5; // Số lần thử tối đa
    const RETRY_DELAY = 10000; // 10 giây
  
    async function fetchData(retries = 0) {
      try {
        const response = await axios.get(AMBASSADOR_URL);  // Đổi GOLD_PRICE_URL thành URL của API giá vàng
  
        if (response && response.status === 200) {
          // Nếu response hợp lệ, trả về kết quả
          console.log(`Data fetched successfully at retry=${retries}`);
          res.json(response.data);
        } else {
          // Nếu response không hợp lệ hoặc có lỗi, thử lại sau 10 giây
          if (retries < MAX_RETRIES) {
            console.log(`Retrying in ${RETRY_DELAY / 1000} seconds... (${retries + 1}/${MAX_RETRIES})`);
            setTimeout(() => fetchData(retries + 1), RETRY_DELAY);
          } else {
            res.status(500).send("Error: Failed to fetch data after multiple attempts.");
          }
        }
      } catch (error) {
        // Nếu gặp lỗi API, thử lại
        if (retries < MAX_RETRIES) {
          console.log(`Error fetching gold price: Retrying in ${RETRY_DELAY / 1000} seconds... (${retries + 1}/${MAX_RETRIES})`);
          setTimeout(() => fetchData(retries + 1), RETRY_DELAY);
        } else {
          console.error("Error fetching API:", error);
          res.status(500).send('Error fetching gold price: ' + error.message);
        }
      }
    }
  
    fetchData();
};  

exports.loadMainPage = (req, res, next) => {
    res.send('This is goldEndPointServer')
};