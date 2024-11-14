const db = require('../config/firebase');
const { doc, updateDoc, collection } = require('firebase/firestore');

module.exports = class goldPricetoDB {
  static async addGoldPrice(userID, goldPrice) {
    try {
      // Lấy tham chiếu tới document trong collection 'accounts'
      const accountRef = doc(collection(db, 'accounts'), userID.toString());

      // Cập nhật trường 'latest_Gold_Price' trong document
      await updateDoc(accountRef, {
        latest_Gold_Price: goldPrice
      });

      console.log('Successfully added gold price');
    } catch (error) {
      console.error('Error adding gold price:', error);
    }
  }
};
