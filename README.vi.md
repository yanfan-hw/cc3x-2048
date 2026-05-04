# 🎮 2048 - Cocos Creator 3.x

🌍 *[Read in English (Đọc bằng Tiếng Anh)](README.md)*

Một phiên bản làm lại của tựa game giải đố 2048 kinh điển, được phát triển bằng **Cocos Creator 3.8.8** và **TypeScript**.

Dự án này không chỉ là một tựa game hoàn chỉnh mà còn đóng vai trò như một **mẫu kiến trúc mã nguồn chuẩn (Boilerplate)**. Nó thể hiện cách áp dụng mô hình MVC, kỹ thuật Object Pooling và chia tách logic một cách gọn gàng trong quá trình phát triển game đa nền tảng.

## ✨ Điểm nổi bật của dự án

* **Kiến trúc MVC:** Logic tính toán toán học (`BoardLogic`) được tách biệt hoàn toàn khỏi logic hiển thị đồ họa (`GameController`). Giúp code dễ đọc, dễ bảo trì và mở rộng.
* **Tối ưu hiệu năng (Object Pooling):** Tuyệt đối không gọi `instantiate` hay `destroy` trong khi chơi. Game chỉ tái sử dụng đúng 16 Node Tile được sinh ra từ đầu, đảm bảo mượt mà 60 FPS trên các máy di động cấu hình yếu.
* **Thuật toán chuẩn xác:** Áp dụng thuật toán *Farthest Position* từ bản gốc của Gabriele Cirulli, xử lý triệt để các lỗi "nhảy ô" hay gộp sai thứ tự thường gặp ở các bản clone khác.
* **Điều khiển đa nền tảng:** Tự động nhận diện môi trường để hỗ trợ mượt mà cả bàn phím (Phím mũi tên/WASD) trên PC máy tính và thao tác vuốt (Swipe) trên thiết bị di động.
* **Lưu điểm tự động:** Hệ thống tự động lưu trữ Kỷ lục (Best Score) vào bộ nhớ thiết bị (Local Storage) một cách an toàn.