# NAM MỘC HƯƠNG — DESIGN & CODEBASE AUDIT (DESIGN_AUDIT.md)

**Dự án**: Nam Mộc Hương — E-Commerce Tinh Dầu Thiên Nhiên Cao Cấp  
**Đơn vị thực hiện**: Creative Director, Senior UI/UX Designer, Creative Developer, E-commerce CRO & Full-stack Architect  
**Ngày thực hiện**: Tháng 10/2026  
**Website mục tiêu**: https://nammochuong.com  

---

## 1. Hiện trạng Workspace & Repository
- **Tình trạng thư mục ban đầu**: Thư mục `c:\Users\PhuongDev\Desktop\landingpage` đang trống (chưa có code cũ).
- **Domain thực tế**: `https://nammochuong.com/` kiểm tra DNS hiện chưa trỏ IP hoặc đang chờ triển khai (No such host).
- **Môi trường kỹ thuật**:
  - Node.js: `v20.20.0`
  - npm: `10.8.2`
  - Skills hệ thống đã nạp và tích hợp:
    + `supabase` (v0.1.2) & `supabase-postgres-best-practices` (v1.1.1)
    + `vercel-labs/agent-skills` (`web-design-guidelines`, `writing-guidelines`, `vercel-optimize`, `vercel-react-best-practices`, `deploy-to-vercel`)
    + `frontend-design` & `web-perf`
- **Kết luận kiến trúc**: Cần khởi tạo một hệ thống thương mại điện tử Next.js (App Router) chuẩn chỉnh từ đầu, áp dụng toàn bộ best practices về kiến trúc hiệu năng, GSAP Animation, Three.js 3D lazy-loaded, Visual CMS Admin và luồng Checkout thực tế.

---

## 2. Nhận diện các vấn đề thường gặp ở website tinh dầu / mỹ phẩm phổ thông (Cần tránh tuyệt đối)
1. **Thiết kế rập khuôn (Generic Template)**:
   - Các template AI thường có nền đen bóng bẩy hoặc nền trắng toát vô hồn, icon vector tải sẵn, font sans-serif khô khan không cảm xúc.
   - Sử dụng gradient neon xanh tím hoặc hiệu ứng kính (glassmorphism) tràn lan, không ăn nhập với tinh thần thảo mộc, gỗ mộc và đất mẹ.
2. **Text thừa và sáo rỗng (Copywriting Flaws)**:
   - Xuất hiện câu chữ vô nghĩa: "Welcome to our website", "Sản phẩm số 1 Việt Nam", "Chất lượng đỉnh cao hàng đầu", "Lorem ipsum".
   - Badge giả tạo không có chứng chỉ xác thực, gây nghi ngờ cho khách hàng thông thái.
   - Text kỹ thuật hoặc hướng dẫn dev bị sót lại trong giao diện.
3. **Hiệu ứng chuyển động quá đà (Animation Overkill)**:
   - Chữ bay lượn từ 4 phía, bounce quá mức, scroll hijacking gây ức chế người dùng.
   - Animation kéo dài khiến khách hàng phải chờ đợi mới bấm được nút Mua hàng.
   - Không hỗ trợ `prefers-reduced-motion` và không dọn dẹp (cleanup) animation khi unmount gây rò rỉ bộ nhớ.
4. **Lạm dụng 3D làm sụt giảm hiệu năng (Heavy 3D Scene)**:
   - Nhúng mô hình GLTF hàng chục MB vào bundle chính gây trắng màn hình trên thiết bị di động 4G.
   - 3D không tương tác hoặc mô hình thô kệch, không phản ánh chất liệu thủy tinh hổ phách và tinh dầu thực tế.
5. **Giao diện Mobile bị bỏ quên (Mobile Degradation)**:
   - Chỉ co nhỏ giao diện desktop (responsive thụ động).
   - Nút bấm quá nhỏ, menu khó thao tác bằng ngón tay cái, bảng giá và bảng chọn dung tích bị vỡ layout.
6. **Landing Page tĩnh, thiếu khả năng bán hàng và tự quản lý**:
   - Chỉ có form "Để lại số điện thoại" đơn giản, không có giỏ hàng (Cart Drawer), không tính toán ship/tổng tiền, không có trang quản trị để thêm sản phẩm mới hay xem đơn hàng.

---

## 3. Định vị giải pháp cho Nam Mộc Hương
- **Phong cách cốt lõi**: *Botanical Luxury × Natural Ritual × Editorial Design × Cinematic Motion*.
- **Cảm giác mang lại**:
  - Thanh tịnh, lắng đọng như bước vào một gian phòng xông hương trầm thảo mộc giữa sớm mai tĩnh mịch.
  - Sang trọng, chỉn chu từ đường nét typography (kết hợp Serif cổ điển và Sans hiện đại), khoảng thở rộng rãi (negative space) đến nhịp chuyển động êm dịu của GSAP.
  - Trải nghiệm mua sắm mượt mà, minh bạch về dung tích, giá thành, cách phối hương và ứng dụng hàng ngày.
- **Tính năng cần thiết**:
  - Full E-commerce: Xem danh mục -> Lọc/chọn sản phẩm -> Xem chi tiết & nốt hương -> Chọn dung tích (10ml, 30ml, 50ml, 100ml) -> Thêm vào giỏ -> Cart Drawer -> Đặt hàng nhanh (Guest Checkout) với validation server-side.
  - Visual CMS Admin: Đăng nhập quản trị -> Quản lý sản phẩm, danh mục, đơn hàng, bài viết, cấu hình banner/hero, liên hệ, chính sách và SEO.
  - GSAP & Three.js Tinh Tế:
    + GSAP Timeline & ScrollTrigger cho các chuyển động xuất hiện mượt mà.
    + Three.js Botanical Amber Essence Scene 3D (chai tinh dầu hổ phách tối giản và hạt sương thảo mộc tương tác theo con trỏ chuột) được lazy-load bằng Dynamic Import, có fallback CSS/ảnh chất lượng cao.
  - Kỹ thuật SEO & Hiệu năng: SSR/SSG chuẩn Next.js, Structured Data Schema (Product, Organization, BreadcrumbList), Sitemap XML, Robots.txt, OpenGraph chuẩn mực.
