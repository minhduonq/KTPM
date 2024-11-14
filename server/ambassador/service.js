// Hàm random int min đến max
const randomInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Hàm kiểm tra kiểu dữ liệu trả về (JSON hay XML)
const checkDataType = (response) => {
  if (typeof response === 'string') {
      // Nếu dữ liệu trả về là chuỗi (string), kiểm tra là JSON hay XML
      const isJson = response.trim().startsWith('{') || response.trim().startsWith('[');
      
      if (isJson) {
          // Dữ liệu JSON
          try {
              return { type: 'json', data: JSON.parse(response) };
          } catch (error) {
              throw new Error('Failed to parse JSON data');
          }
      } else {
          // Dữ liệu XML
          try {
              response = response.replace(/<!--[\s\S]*?-->/g, '').trim(); // Loại bỏ comment trong XML
              return { type: 'xml', data: response };
          } catch (error) {
              throw new Error('Failed to process XML data');
          }
      }
  } else if (typeof response === 'object') {
      // Dữ liệu JSON đã được phân tích cú pháp rồi
      return { type: 'json', data: response };
  } else {
      throw new Error('Invalid response data type');
  }
}

module.exports = {
  randomInRange,
  checkDataType
}