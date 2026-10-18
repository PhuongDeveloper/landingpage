# NAM MỘC HƯƠNG — DESIGN SYSTEM SPECIFICATION (DESIGN_SYSTEM.md)

**Brand Identity**: Botanical Luxury × Natural Ritual × Editorial Design × Cinematic Motion  
**Target Brand**: Nam Mộc Hương (Tinh dầu thiên nhiên & Liệu pháp mùi hương)  
**Standard**: WCAG 2.1 AA Compliant · 60fps Smooth Motion · Responsive First  

---

## 1. Color Palette (Bảng màu định hướng thảo mộc cao cấp)

| Tên màu | Mã Hex | RGB | Ứng dụng chính |
| :--- | :--- | :--- | :--- |
| **Warm Ivory** | `#F7F4EC` | `247, 244, 236` | Nền chính của toàn website, tạo cảm giác giấy mỹ thuật tự nhiên, dịu mắt |
| **Botanical Green** | `#354B3C` | `53, 75, 60` | Màu thương hiệu chủ đạo, tiêu đề chính, nút bấm chính, viền điểm nhấn |
| **Deep Forest** | `#1E2D24` | `30, 45, 36` | Tiêu đề tối, thanh điều hướng trạng thái cuộn, footer sang trọng |
| **Sage (Cây xô thơm)** | `#8E9B82` | `142, 155, 130` | Nhãn phụ (badge), đường kẻ trang trí, trạng thái phụ, hover nhẹ |
| **Earth Brown** | `#705943` | `112, 89, 67` | Màu chữ bổ trợ, nốt hương gỗ (Woody notes), chi tiết mộc mạc |
| **Soft Gold** | `#B7A078` | `183, 160, 120` | Ánh kim mộc, viền thẻ sản phẩm tuyển chọn, sao đánh giá tinh tế |
| **Pure White** | `#FFFFFF` | `255, 255, 255` | Nền thẻ sản phẩm, dropdown menu, modal giỏ hàng, contrast block |
| **Charcoal Body** | `#2C332D` | `44, 51, 45` | Màu chữ nội dung chính (body text), đảm bảo độ tương phản > 7:1 |
| **Muted Clay** | `#E8E2D5` | `232, 226, 213` | Màu đường viền mảnh (border), nền phân cách nhẹ nhàng |

> **Nguyên tắc phối màu**: Tránh hoàn toàn nền đen tuyền nhân tạo (#000000) và gradient tím/xanh neon. Mọi sắc thái đều lấy cảm hứng từ cây cỏ, vỏ cây, đất ẩm và ánh nắng sớm xuyên qua tán lá.

---

## 2. Typography Scale (Hệ thống chữ nghệ thuật tiếng Việt)

- **Display & Headline Font**: `Playfair Display` kết hợp `Cormorant Garamond` (Serif cổ điển, có dấu tiếng Việt hoàn chỉnh, sang trọng, giàu nhạc tính và chiều sâu).
- **Body & Interface Font**: `Plus Jakarta Sans` hoặc `Inter` (Sans-serif hiện đại, nét thanh thoát, hỗ trợ tiếng Việt hoàn hảo, rõ ràng ở mọi kích thước nhỏ).

### Thang kích thước chữ (Type Scale):
- **Hero Display**: `clamp(2.75rem, 6vw, 4.5rem)` — Line-height: 1.15 — Letter-spacing: `-0.02em`
- **H1 (Editorial Titles)**: `clamp(2.25rem, 4.5vw, 3.25rem)` — Line-height: 1.2 — Font weight: 600
- **H2 (Section Headings)**: `clamp(1.75rem, 3.5vw, 2.5rem)` — Line-height: 1.25 — Font weight: 500
- **H3 (Product / Card Titles)**: `1.25rem` – `1.5rem` — Line-height: 1.35 — Font weight: 600
- **Subtitle / Eyebrow**: `0.8125rem` (13px) — Line-height: 1.5 — Uppercase — Letter-spacing: `0.15em` — Font weight: 600
- **Body Large**: `1.125rem` (18px) — Line-height: 1.7 — Font weight: 400
- **Body Normal**: `1rem` (16px) — Line-height: 1.65 — Font weight: 400
- **Caption / Metadata**: `0.875rem` (14px) — Line-height: 1.5 — Font weight: 400
- **Microcopy**: `0.75rem` (12px) — Line-height: 1.4 — Font weight: 500

---

## 3. Spacing & Layout Architecture

- **Page Container**: `max-w-7xl` (1280px) canh giữa với lề an toàn:
  - Mobile: `px-4` (16px)
  - Tablet: `px-6` (24px)
  - Desktop: `px-8` (32px)
  - Ultra-wide: `px-12` (48px)
- **Section Spacing**:
  - Desktop: `py-24` đến `py-32` (96px – 128px) tạo không gian thở editorial phóng khoáng.
  - Mobile: `py-16` đến `py-20` (64px – 80px) gọn gàng, liền mạch.
- **Card Padding**: `p-6` đến `p-8` với bo góc mềm mại tự nhiên: `rounded-2xl` (16px) hoặc `rounded-3xl` (24px).
- **Border Radius Philosophy**:
  - Nút bấm (Buttons): `rounded-full` (Pill shape cao cấp) hoặc `rounded-lg` (8px).
  - Thẻ sản phẩm (Cards): `rounded-2xl` (16px) với đường viền mảnh `border border-[#E8E2D5]`.
  - Hộp nhập liệu (Inputs): `rounded-xl` (12px) với nền mờ hoặc trắng ngà.

---

## 4. UI Components Specification

### 4.1 Buttons (Nút hành động)
- **Primary CTA**: Nền `Botanical Green (#354B3C)`, chữ trắng, hover chuyển sang `Deep Forest (#1E2D24)` với transition mượt, shadow nhẹ nhàng `shadow-sm hover:shadow-md`.
- **Secondary CTA**: Nền trong suốt hoặc trắng ngà, viền `border border-[#354B3C]`, chữ `Botanical Green`, hover phủ nền `Botanical Green` chữ trắng.
- **Ghost / Text Button**: Chữ `Botanical Green` hoặc `Earth Brown`, gạch chân tinh tế với hiệu ứng gạch chân mở rộng khi hover (`after:w-full`).

### 4.2 Product Cards (Thẻ sản phẩm nghệ thuật)
- Khung hình tỷ lệ `aspect-[4/5]` chuẩn studio nhiếp ảnh thảo mộc.
- Badge danh mục / dung tích tinh tế ở góc trên.
- Hiển thị đầy đủ: Tên sản phẩm, Tầng hương chính, Giá bán niêm yết, Giá khuyến mãi (nếu có), Nút "Thêm vào giỏ" hoặc "Xem chi tiết".
- Hiệu ứng hover: Phóng to ảnh nhẹ (`scale-[1.03]`), nổi bật nút thêm nhanh giỏ hàng.

### 4.3 Form Controls & Checkout Inputs
- Trường nhập họ tên, số điện thoại, địa chỉ, ghi chú.
- Focus state rõ ràng với viền `Botanical Green` và outline ring `ring-2 ring-[#354B3C]/20`.
- Thông báo lỗi tiếng Việt cụ thể, không dùng thuật ngữ kỹ thuật.

---

## 5. Motion Principles (Nguyên tắc chuyển động với GSAP)

1. **Ý định rõ ràng (Purposeful Motion)**: Chuyển động dẫn dắt mắt người đọc từ câu chuyện thương hiệu đến chi tiết sản phẩm.
2. **Nhịp điệu tự nhiên (Organic Easing)**:
   - Dùng `power3.out` hoặc `expo.out` cho các chuyển động xuất hiện.
   - Thời lượng lý tưởng: `0.8s` – `1.2s` cho hero sequence; `0.4s` – `0.6s` cho tương tác vi mô (micro-interactions).
3. **Stagger tinh tế**: Tiêu đề từng dòng chữ xuất hiện nối tiếp cách nhau `0.08s` – `0.12s`.
4. **Parallax có kiểm soát**: Hình ảnh thảo mộc trôi nhẹ với biên độ tối đa `20px` – `40px` để không gây mỏi mắt hay giật lag.
5. **Accessibility**: Kiểm tra `window.matchMedia('(prefers-reduced-motion: reduce)')`. Nếu người dùng bật giảm chuyển động, tắt toàn bộ transform dịch chuyển và chỉ dùng fade nhanh.
6. **Cleanup**: Luôn giải phóng `ctx.revert()` trong `useEffect` hoặc `useGSAP` để tránh rò rỉ bộ nhớ.

---

## 6. Three.js / R3F Amber Botanical Scene

- **Mục tiêu**: Tái hiện chiếc lọ tinh dầu thủy tinh hổ phách (Amber Glass Bottle) xoay nhẹ trong không gian ánh sáng ấm áp với các phân tử hương thơm bay bổng.
- **Tối ưu hóa hiệu năng**:
  - Lazy load 100% bằng dynamic import `next/dynamic` với `ssr: false`.
  - Fallback là hình ảnh render sắc nét tĩnh để thời gian tải trang ban đầu (LCP) đạt điểm tối ưu.
  - Tự động tạm dừng render loop khi scene ra ngoài khung nhìn (IntersectionObserver).
  - Tắt hiệu ứng 3D trên màn hình mobile nhỏ hơn 768px để bảo vệ pin và tiết kiệm băng thông.

---

## 7. Accessibility (A11y) & Usability

- Tương phản màu sắc tuân thủ WCAG AA (> 4.5:1 với text thường, > 3:1 với text lớn và UI controls).
- Tất cả hình ảnh có thuộc tính `alt` mô tả nội dung có nghĩa.
- Đầy đủ focus indicator cho người dùng duyệt bằng bàn phím (Tab navigation).
- Các nút bấm icon (giỏ hàng, đóng mở menu) luôn có `aria-label` chi tiết.
