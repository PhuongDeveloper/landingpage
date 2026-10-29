# Triển khai Nam Mộc Hương

Nhánh `codex/site-rebuild` chứa giao diện và luồng quản trị mới. Website production hiện chạy từ `main` cho đến khi các bước dưới đây hoàn tất.

## 1. Chuẩn bị khóa

Trong Supabase, tạo hoặc lấy **server secret key** cho project đang chứa dữ liệu thật. Khóa cũ từng nằm trong lịch sử Git, nên cần thu hồi/đổi. Khóa ImgBB cũ cũng từng nằm trong lịch sử Git và cần đổi nếu tiếp tục dùng tải ảnh.

Trong Vercel Project → Settings → Environment Variables, đặt các biến cho **Production**:

| Biến | Giá trị |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL project Supabase đang dùng |
| `SUPABASE_SERVICE_ROLE_KEY` hoặc `SUPABASE_SECRET_KEY` | Khóa server mới; tuyệt đối không dùng tiền tố `NEXT_PUBLIC_` |
| `ADMIN_PASSWORD` | Mật khẩu quản trị mới, ít nhất 12 ký tự |
| `ADMIN_SESSION_SECRET` | Chuỗi ngẫu nhiên ít nhất 32 ký tự |
| `NEXT_PUBLIC_SITE_URL` | `https://nammochuong.com` |
| `IMGBB_API_KEY` | Khóa mới nếu cần tải ảnh từ admin |

`NEXT_PUBLIC_SUPABASE_ANON_KEY` không còn cần cho luồng server hiện tại. Không đưa bất kỳ khóa server nào vào client hoặc repository.

## 2. Bảo vệ dữ liệu

Sau khi đã đặt khóa server và trước khi đưa nhánh mới lên production, chạy [security_lockdown.sql](supabase/security_lockdown.sql) trong SQL Editor của đúng project Supabase. Script gỡ các policy từng cho anonymous đọc đơn hàng/thông tin khách và sửa nội dung. Kiểm tra project và sao lưu dữ liệu trước khi chạy. Đừng chạy lại `supabase_setup.sql` trên database đang có dữ liệu.

## 3. Triển khai

Tạo Preview Deployment từ `codex/site-rebuild` trong Vercel, kiểm tra các trang và thao tác admin với dữ liệu thật. Khi ổn, đưa nhánh này vào `main` và Promote/Deploy Production. Sau deploy, mở `https://nammochuong.com/admin`, đăng nhập bằng mật khẩu mới và kiểm tra tạo/sửa/xóa một bản ghi thực tế; kiểm tra lại trang public sau khi tải lại.

Vercel hiện tự deploy khi `main` thay đổi. Không đẩy nhánh mới lên `main` trước khi đặt biến môi trường và khóa quyền Supabase: server sẽ báo lỗi vì cố ý không dùng bộ nhớ tạm làm nguồn dữ liệu production.
