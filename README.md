Cách chạy project
- Tải Docker Desktop và NodeJS
- Clone Repository về và sử dụng terminal cd vào các folder client, api-gold-price, api-fe-rate
- Chạy lệnh npm install để tải các dependencies cho 3 folder
- cd về lại folder server
- Chạy lệnh docker-compose up --build để build 2 container chạy ở 2 port 4000 và 5000
- Kiểm tra 2 cổng http://localhost:4000 và http://localhost:5000 nếu hiện message thì là chạy đúng
- Cd về thư mục client và chạy npm run dev rồi vào port http://localhost:3000 để kiểm tra kết quả.
 
