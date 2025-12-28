# Hướng Dẫn Cấu Hình Cloudinary

## Bước 1: Tạo Tài Khoản Cloudinary

1. Truy cập [https://cloudinary.com/users/register_free](https://cloudinary.com/users/register_free)
2. Đăng ký tài khoản miễn phí (Free Tier - 25GB storage)
3. Điền form đăng ký:
   - Email
   - Password
   - Chọn "I'm a developer"
4. Click **Create Account**
5. Xác nhận email (check hộp thư)

## Bước 2: Lấy Cloud Name

Sau khi đăng nhập vào Cloudinary:

1. Bạn sẽ thấy **Dashboard** (trang chủ)
2. Ở phần **Account Details** (góc trên bên phải), bạn sẽ thấy:
   ```
   Cloud name: your_cloud_name_here
   API Key: 123456789012345
   API Secret: *********************
   ```
3. **Cloud Name** chính là giá trị bạn cần!

**Ví dụ**: Nếu Cloud Name của bạn là `di2slzm7m`, thì trong `.env.local`:
```env
VITE_CLOUDINARY_CLOUD_NAME=di2slzm7m
```

## Bước 3: Tạo Upload Preset

1. Trong Cloudinary Dashboard, click vào **Settings** (icon bánh răng) ở góc trên
2. Chọn tab **Upload**
3. Scroll xuống phần **Upload presets**
4. Click **Add upload preset**
5. Điền thông tin:
   - **Preset name**: `family` (hoặc tên bạn thích)
   - **Signing Mode**: Chọn **Unsigned** ⚠️ (quan trọng!)
   - Các option khác để mặc định
6. Click **Save**

Sau đó trong `.env.local`:
```env
VITE_CLOUDINARY_UPLOAD_PRESET=family
```

## Bước 4: Cấu Hình Environment Variables

1. Copy file `.env.example` thành `.env.local`:
   ```bash
   copy .env.example .env.local
   ```

2. Mở file `.env.local` và điền thông tin:
   ```env
   # Cloudinary Configuration
   VITE_CLOUDINARY_CLOUD_NAME=di2slzm7m
   VITE_CLOUDINARY_UPLOAD_PRESET=family
   ```

3. **Lưu ý**: File `.env.local` đã được thêm vào `.gitignore`, không bị commit lên Git

## Bước 5: Chạy Ứng Dụng

1. Cài đặt dependencies (nếu chưa):
   ```bash
   npm install
   ```

2. Chạy development server:
   ```bash
   npm run dev
   ```

3. Mở trình duyệt tại: `http://localhost:8081`

## Bước 6: Test Upload

1. Vào trang **Tải lên** (`/upload`)
2. Chọn hoặc kéo thả file ảnh/video
3. Điền thông tin: năm, tiêu đề, mô tả
4. Click **Tải lên**
5. Kiểm tra:
   - Toast notification hiển thị "Thành công!"
   - File được upload lên Cloudinary
   - Metadata được lưu vào localStorage

## Bước 7: Test Hiển Thị và Download

1. Vào trang **Hình ảnh** (`/photos`) hoặc **Video** (`/videos`)
2. Kiểm tra ảnh/video vừa upload hiển thị
3. Hover vào ảnh, click nút **Download** (icon mũi tên xuống)
4. File sẽ được download về máy

## Troubleshooting

### Lỗi: "Cloudinary configuration is missing"
- Kiểm tra file `.env.local` đã tạo chưa
- Kiểm tra tên biến có đúng không (phải có prefix `VITE_`)
- Restart dev server sau khi thay đổi `.env.local`

### Lỗi khi upload: "Failed to upload file"
- Kiểm tra kết nối internet
- Kiểm tra Cloudinary upload preset có đúng không
- Kiểm tra upload preset đã set **Unsigned** mode
- Kiểm tra file size (free tier có giới hạn)

### Ảnh không hiển thị sau khi refresh
- Kiểm tra localStorage có bị xóa không
- Mở DevTools → Application → Local Storage → Xem `family_media_store`

## Giới Hạn Free Tier

### Cloudinary Free Tier:
- 25GB storage
- 25GB bandwidth/month
- Unlimited transformations
- Unlimited uploads

## Deploy lên Vercel

### Bước 1: Push code lên GitHub

```bash
git add .
git commit -m "Add Cloudinary integration"
git push
```

### Bước 2: Import vào Vercel

1. Vào [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import từ GitHub repository
4. Chọn repo của bạn

### Bước 3: Configure Environment Variables

Trong Vercel dashboard, thêm:
- `VITE_CLOUDINARY_CLOUD_NAME` = `di2slzm7m`
- `VITE_CLOUDINARY_UPLOAD_PRESET` = `family`

### Bước 4: Deploy

Click "Deploy" và đợi vài phút!

## Lưu Ý Quan Trọng

- ✅ **Cloud Name** là public, không cần giữ bí mật
- ✅ **Upload Preset** phải ở chế độ **Unsigned**
- ⚠️ **API Secret** KHÔNG cần thiết cho project này
- 💾 Metadata được lưu trong **localStorage** của browser
- 🔄 Refresh browser vẫn giữ được data (từ localStorage)

## Nâng Cấp (Tùy Chọn)

Nếu cần nhiều storage hơn:
1. Upgrade Cloudinary plan (từ $99/tháng)
2. Hoặc implement backend để lưu metadata vào database
