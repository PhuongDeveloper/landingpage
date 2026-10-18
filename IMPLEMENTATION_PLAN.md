# NAM MỘC HƯƠNG — KẾ HOẠCH TRIỂN KHAI TOÀN DIỆN (IMPLEMENTATION_PLAN.md)

---

## Danh mục các giai đoạn (Phases)

### Phase A: Audit Repository & Cài đặt Skills (Hoàn thành)
- [x] Kiểm tra cấu trúc workspace và môi trường runtime (Node.js 20, npm 10).
- [x] Cài đặt `supabase/agent-skills` (v0.1.2) và `supabase-postgres-best-practices` (v1.1.1).
- [x] Cài đặt `vercel-labs/agent-skills` (web-design-guidelines, writing-guidelines, vercel-optimize, vercel-react-best-practices).
- [x] Đọc và tích lũy kiến thức từ các tài liệu SKILL.md.
- [x] Soạn thảo `DESIGN_AUDIT.md`.

### Phase B: Creative Direction & Design System (Hoàn thành)
- [x] Xây dựng `DESIGN_SYSTEM.md` với bảng màu Warm Ivory, Botanical Green, Deep Forest, Sage, Soft Gold.
- [x] Xác lập chuẩn typography tiếng Việt (Playfair Display, Cormorant Garamond, Plus Jakarta Sans).
- [x] Quy định motion principles, responsive rules và tiêu chuẩn a11y.

### Phase C: Khởi tạo Base Project & Thiết kế lại Toàn diện Trang Chủ
- [ ] Khởi tạo dự án Next.js 14/15 App Router với TypeScript, Tailwind CSS, Lucide Icons.
- [ ] Cài đặt các thư viện chuyển động: `gsap`, `@gsap/react`, `three`, `@react-three/fiber`, `@react-three/drei`.
- [ ] Cấu hình font Google tiếng Việt tối ưu không gây layout shift.
- [ ] Xây dựng các Section trang chủ:
  - **Header & Navigation**: Logo Nam Mộc Hương nghệ thuật, menu điều hướng, thanh tìm kiếm nhanh, nút Cart Drawer kèm badge số lượng.
  - **Section B — Hero**: Bố cục Editorial giàu cảm xúc, typography mạnh mẽ, CTA dẫn thẳng tới bộ sưu tập, hiệu ứng ánh sáng thiên nhiên.
  - **Section C — Brand Introduction**: Khởi nguồn và triết lý chưng cất tự nhiên thuần khiết từ thảo mộc bản địa.
  - **Section D — Product Categories**: Bộ sưu tập danh mục theo phong cách editorial (Tinh dầu đơn hương, Tinh dầu phối hương Relax/Sleep/Focus, Tinh dầu xông phòng, Dầu massage thảo mộc).
  - **Section E — Featured Products**: Danh sách sản phẩm thực tế từ Database, hiển thị chi tiết nốt hương, dung tích, giá gốc, giá ưu đãi.
  - **Section F — Botanical Story**: Câu chuyện nguyên liệu (Vỏ cam sành Hà Giang, Trầm hương Quảng Nam, Sả chanh Tây Bắc, Hoa mộc Yên Bái).
  - **Section G — Product Ritual / How to Use**: Nghi thức khuếch tán, xoa dịu huyệt đạo, tắm xông thư giãn.
  - **Section H — Brand Values**: Cam kết 100% tinh chất thảo mộc thuần tự nhiên, không hương liệu tổng hợp, bảo tồn thổ nhưỡng.
  - **Section I — Testimonials**: Trải nghiệm thực tế từ các chuyên gia trị liệu tự nhiên và người yêu hương.
  - **Section J — Journal / Blog**: Cẩm nang sống lành và kiến thức liệu pháp mùi hương chuẩn SEO.
  - **Section K — Footer & Contact**: Thông tin liên hệ, hotline, Zalo, địa chỉ, chính sách giao hàng và đổi trả.

### Phase D: Đồng bộ Danh mục, Chi tiết Sản phẩm, Cart Drawer & Checkout
- [ ] Xây dựng trang danh mục sản phẩm lọc theo công dụng và tầng hương.
- [ ] Xây dựng trang chi tiết sản phẩm (`/san-pham/[slug]`):
  - Bộ chọn dung tích (10ml, 30ml, 50ml, 100ml) với giá cập nhật tức thời.
  - Tầng hương (Top Notes, Middle Notes, Base Notes) trực quan.
  - Tab hướng dẫn sử dụng, bảo quản, cảnh báo an toàn.
- [ ] Xây dựng Cart Drawer trượt mượt mà từ cạnh phải màn hình.
- [ ] Xây dựng trang Thanh toán (`/thanh-toan`):
  - Guest checkout tinh gọn, không bắt buộc đăng ký tài khoản.
  - Form xác thực số điện thoại và địa chỉ giao nhận tại Việt Nam.
  - Tính toán tổng tiền, miễn phí vận chuyển cho đơn hàng đạt hạn mức.
  - Xử lý tạo đơn hàng thực tế vào Database và hiển thị màn hình xác nhận kèm mã đơn hàng.

### Phase E: Tích hợp GSAP Animation & Three.js Amber Bottle Scene
- [ ] Dàn dựng GSAP timeline cho intro và ScrollTrigger cho các section.
- [ ] Tích hợp `useGSAP` với cơ chế cleanup chuẩn `revert()`.
- [ ] Xây dựng Three.js Component: Chiếc chai tinh dầu thủy tinh hổ phách và sương thảo mộc bay lơ lửng, phản hồi nhẹ theo chuột.
- [ ] Áp dụng Next.js Dynamic Import (`ssr: false`) và static fallback cho Three.js.
- [ ] Kiểm tra và tương thích `prefers-reduced-motion`.

### Phase F: Visual CMS Admin (`/admin`) & Data Layer
- [ ] Xây dựng hệ thống Data Layer linh hoạt:
  - Hỗ trợ Supabase Client (`@supabase/supabase-js`) với đầy đủ migration SQL, RLS và schema.
  - Hỗ trợ Local Database Engine (lưu trữ JSON an toàn trong hệ thống) giúp website chạy mượt mà ngay cả khi chưa có kết nối mạng tới Supabase.
- [ ] Trang Quản trị trực quan (`/admin`):
  - Dashboard thống kê tổng quan (Doanh thu, Đơn hàng mới, Sản phẩm còn hàng).
  - Quản lý Sản phẩm (Thêm mới, sửa giá, sửa ảnh, sửa nốt hương, cập nhật tồn kho).
  - Quản lý Đơn hàng (Xem chi tiết đơn, đổi trạng thái: Chờ xác nhận, Đang xử lý, Đang giao, Đã giao, Đã hủy).
  - Quản lý Nội dung Banner / Hero / Thông tin liên hệ / SEO.
  - Tính năng Preview & Publish trực tiếp cập nhật dữ liệu frontend.

### Phase G: Kỹ thuật SEO & Hiệu năng
- [ ] Triển khai JSON-LD Structured Data (`Product`, `Offer`, `BreadcrumbList`, `Organization`).
- [ ] Cấu hình Metadata tiếng Việt hoàn chỉnh cho từng trang: Title, Description, OpenGraph, Canonical.
- [ ] Tạo Dynamic Sitemap XML (`/sitemap.xml`) và `robots.txt`.
- [ ] Tối ưu hình ảnh, lazy loading, font optimization.

### Phase H: Kiểm thử toàn diện & Rà soát văn bản
- [ ] Rà soát 100% câu chữ: Loại bỏ mọi lorem ipsum, placeholder vô nghĩa, thuật ngữ kỹ thuật.
- [ ] Chạy build production (`npm run build`) và kiểm tra TypeScript lint.
- [ ] Kiểm thử luồng đặt hàng và cập nhật đơn hàng trong Admin.

### Phase I: Hoàn thiện Tài liệu Bàn giao & Sẵn sàng Vercel
- [ ] Cấu hình `vercel.json` và file biến môi trường mẫu `.env.example`.
- [ ] Viết tài liệu hướng dẫn bàn giao chi tiết.
