//const gpModel = require('../models/fe-rate-model')
const axios = require('axios')
const xml2js = require('xml2js');

exports.getFERate = async (req, res, next) => {
  try {
    const response = await axios.get('https://portal.vietcombank.com.vn/Usercontrols/TVPortal.TyGia/pXML.aspx');
    const xmlData = response.data;

    xml2js.parseString(xmlData, (err, result) => {
      if (err) {
        res.status(500).send("Error while parsing XML");
      } else {
        res.json(result);
      }
    });
  } catch (error) {
    console.error("Error fetching API:", error);
    res.status(500).send("Error fetching data from Vietcombank API");
  }
}

exports.loadMainPage = (req, res, next) => {
  res.send('This is FE Rate server!')
};