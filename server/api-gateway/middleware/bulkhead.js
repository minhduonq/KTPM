const { Semaphore } = require('async-mutex');

const createBulkhead = (maxConcurrent) => {
  const semaphore = new Semaphore(maxConcurrent);

  return async (req, res, next) => {
    try {
      await semaphore.acquire();
      res.on('finish', () => {
        semaphore.release();
      });
      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = createBulkhead;
/*
Semaphore kiểm soát số lượng truy cập đồng thời vào 1 tài nguyên
function createBulkhead = nhận vào maxCotent là số lượng max request
=> khi 1 yêu cầu đến, gọi acquire để lấy 1 vị trí trong semaphore 
=> Khi xong thì release
*/