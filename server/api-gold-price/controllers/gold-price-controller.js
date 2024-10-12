const gpModel = require('../models/goldPriceModel')
const axios = require('axios')
const {exec} = require('child_process');
/*
exports.setGoldPrice = (req,res,next) => {
    const {goldPrice} = req.body;
    gpModel.addGoldPrice(1,goldPrice);
}
*/

exports.getGoldPrice = async (req,res,next) => {
    try {
        const response = await axios.get('https://apiforlearning.zendvn.com/api/get-gold', {
          headers: {
            'accept': 'application/json'
          }
        });
        res.json(response.data);
      } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching gold price:' + error);
    }
}

exports.loadMainPage = (req, res, next) => {
    res.send('This is goldEndPointServer')
};