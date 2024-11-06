Cách chạy project
- Tải Docker Desktop và NodeJS
- Clone Repository về và sử dụng terminal cd vào các folder client, api-gold-price, api-fe-rate
- Chạy lệnh npm install để tải các dependencies cho 3 folder
- cd về lại folder server
- Chạy lệnh docker-compose up --build để build 2 container chạy ở 2 port 4000 và 5000
- Kiểm tra 2 cổng http://localhost:4000 và http://localhost:5000 nếu hiện message thì là chạy đúng
- Cd về thư mục client và chạy npm run dev rồi vào port http://localhost:3000 để kiểm tra kết quả.
 
Cách chạy các container docker Node Exporter, Grafana, Prometheus
- Pull mới nhất từ nhánh/kien
- Dùng terminal cd server chạy lệnh docker-compose up -d
- Vào docker desktop xem các container đang chạy
- Truy cập port của Prometheus:
![Hiện như này thì là đúng](<Screenshot 2024-11-04 225223.png>)
- Vào grafana đăng nhập tài khoản + mật khẩu là admin rồi đổi mật khẩu
- Add data source -> Chọn prometheus -> điền Prometheus server là http://prometheus:9090/ -> Bấm save and test (tick v là đúng)
- Bấm home và chọn create Dashboards -> import dashboards -> gõ id 1860 
![alt text](image.png) -> rồi đặt tên cho dashboard và chọn nguồn dữ liệu là prometheus vừa tạo -> Ra dashboard là ok.