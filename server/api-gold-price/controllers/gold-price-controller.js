const gpModel = require('../models/goldPriceModel')
const axios = require('axios')
const {exec} = require('child_process');
/*
exports.setGoldPrice = (req,res,next) => {
    const {goldPrice} = req.body;
    gpModel.addGoldPrice(1,goldPrice);
}
*/

const AmbassadorService = require('../ambassadorService')

const goldURL = 'https://sjc.com.vn/GoldPrice/Services/PriceService.ashx'

// Đặt failure threshold = 3, success threshold = 1
const ambassadorService = new AmbassadorService(goldURL, 3, 1)

exports.getGoldPrice = async (req,res,next) => {
    try {
        // const response = await axios.get('https://apiforlearning.zendvn.com/api/get-gold', {
        //   headers: {
        //     'accept': 'application/json'
        //   }
        // });
        const response = await ambassadorService.fetchData()
        res.json(response.data);
      } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching gold price:' + error);
    }
}

exports.loadMainPage = (req, res, next) => {
    res.send('This is goldEndPointServer')
};