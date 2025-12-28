# Gia Đình Ba Thân - Family Photo & Video Management

Ứng dụng web quản lý ảnh và video gia đình với tích hợp Pinecone vector database và Cloudinary storage.

## ✨ Tính Năng

- 📸 **Upload ảnh/video**: Tải lên từ PC hoặc mobile với drag & drop
- 🗂️ **Quản lý theo năm**: Lọc và xem ảnh/video theo năm
- ⬇️ **Download**: Tải xuống ảnh/video về máy
- 🔍 **Tìm kiếm**: Metadata được lưu trong Pinecone để tìm kiếm nhanh
- 📱 **Responsive**: Hoạt động tốt trên mọi thiết bị

## 🚀 Công Nghệ

- **Frontend**: React + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn-ui + Framer Motion
- **Database**: Pinecone (vector database)
- **Storage**: Cloudinary (image/video hosting)
- **State Management**: TanStack Query (React Query)

## 📋 Yêu Cầu

- Node.js 18+ và npm
- Tài khoản Pinecone (free tier)
- Tài khoản Cloudinary (free tier)

## ⚙️ Cài Đặt

### 1. Clone repository

```bash
git clone <YOUR_GIT_URL>
cd Gia-Dinh-Ba-Than
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình environment variables

Xem hướng dẫn chi tiết trong [SETUP_GUIDE.md](./SETUP_GUIDE.md)

```bash
# Copy file mẫu
copy .env.example .env.local

# Sau đó điền thông tin vào .env.local:
# - VITE_PINECONE_API_KEY
# - VITE_PINECONE_INDEX
# - VITE_CLOUDINARY_CLOUD_NAME
# - VITE_CLOUDINARY_UPLOAD_PRESET
```

### 4. Chạy development server

```bash
npm run dev
```

Mở trình duyệt tại: `http://localhost:8080`

## 📖 Hướng Dẫn Sử Dụng

### Upload Ảnh/Video

1. Vào trang **Tải lên** (`/upload`)
2. Kéo thả hoặc click để chọn file
3. Điền thông tin: năm, tiêu đề, mô tả
4. Click **Tải lên**

### Xem và Download

1. Vào **Hình ảnh** (`/photos`) hoặc **Video** (`/videos`)
2. Lọc theo năm nếu cần
3. Click vào ảnh để xem full size
4. Hover và click nút Download để tải xuống

## 🏗️ Cấu Trúc Project

```
src/
├── components/       # React components
│   ├── MediaCard.tsx    # Card hiển thị ảnh/video với download button
│   ├── MediaModal.tsx   # Modal xem full size
│   └── ...
├── pages/           # Pages
│   ├── Upload.tsx      # Trang upload
│   ├── Photos.tsx      # Trang xem ảnh
│   └── Videos.tsx      # Trang xem video
├── services/        # API services
│   ├── pinecone.ts     # Pinecone integration
│   ├── storage.ts      # Cloudinary integration
│   └── media.ts        # Unified media service
├── hooks/           # Custom React hooks
│   └── useMedia.ts     # React Query hooks
└── data/            # Data types
    └── mockData.ts     # TypeScript interfaces
```

## 🔧 Scripts

```bash
npm run dev          # Chạy development server
npm run build        # Build production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 📝 Environment Variables

Xem file `.env.example` để biết các biến cần thiết.

**Lưu ý**: Không commit file `.env.local` lên Git!

## 🚢 Deploy

### Vercel (Recommended)

1. Push code lên GitHub
2. Import project vào Vercel
3. Thêm environment variables trong Vercel dashboard
4. Deploy!

### Lovable

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share → Publish.

## 🐛 Troubleshooting

Xem [SETUP_GUIDE.md](./SETUP_GUIDE.md) phần Troubleshooting.

## 📄 License

Private family project.

