// Mock data for development - replace with real data from backend later
export interface MediaItem {
  id: string;
  type: "image" | "video";
  src: string;
  thumbnail?: string;
  title: string;
  year: number;
  description?: string;
  uploadedBy?: string;
  createdAt: string;
}

export const mockPhotos: MediaItem[] = [
  {
    id: "1",
    type: "image",
    src: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800",
    title: "Tết Nguyên Đán",
    year: 2024,
    description: "Cả gia đình sum họp đón Tết",
    createdAt: "2024-02-10",
  },
  {
    id: "2",
    type: "image",
    src: "https://images.unsplash.com/photo-1606567595334-d39972c85dfd?w=800",
    title: "Sinh nhật bà",
    year: 2024,
    description: "Tiệc sinh nhật bà 70 tuổi",
    createdAt: "2024-03-15",
  },
  {
    id: "3",
    type: "image",
    src: "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800",
    title: "Picnic cuối tuần",
    year: 2023,
    description: "Gia đình đi picnic ở công viên",
    createdAt: "2023-11-20",
  },
  {
    id: "4",
    type: "image",
    src: "https://images.unsplash.com/photo-1529543544277-750e1f4bf1de?w=800",
    title: "Trung Thu",
    year: 2023,
    description: "Các cháu rước đèn Trung Thu",
    createdAt: "2023-09-29",
  },
  {
    id: "5",
    type: "image",
    src: "https://images.unsplash.com/photo-1516589091380-5d8e87df6999?w=800",
    title: "Du lịch Đà Lạt",
    year: 2023,
    description: "Chuyến du lịch gia đình",
    createdAt: "2023-07-15",
  },
  {
    id: "6",
    type: "image",
    src: "https://images.unsplash.com/photo-1484820540004-14229fe36ca4?w=800",
    title: "Giỗ ông nội",
    year: 2022,
    description: "Cúng giỗ ông nội",
    createdAt: "2022-08-10",
  },
  {
    id: "7",
    type: "image",
    src: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=800",
    title: "Lễ cưới cháu Hương",
    year: 2022,
    description: "Đám cưới cháu gái Hương",
    createdAt: "2022-05-20",
  },
  {
    id: "8",
    type: "image",
    src: "https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?w=800",
    title: "Tết 2022",
    year: 2022,
    description: "Sum họp đầu năm mới",
    createdAt: "2022-02-01",
  },
];

export const mockVideos: MediaItem[] = [
  {
    id: "v1",
    type: "video",
    src: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
    thumbnail: "https://images.unsplash.com/photo-1516589091380-5d8e87df6999?w=800",
    title: "Tiệc sinh nhật bà",
    year: 2024,
    description: "Video tiệc sinh nhật bà 70 tuổi",
    createdAt: "2024-03-15",
  },
  {
    id: "v2",
    type: "video",
    src: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
    thumbnail: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800",
    title: "Đón giao thừa",
    year: 2024,
    description: "Khoảnh khắc đón năm mới",
    createdAt: "2024-02-09",
  },
  {
    id: "v3",
    type: "video",
    src: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
    thumbnail: "https://images.unsplash.com/photo-1529543544277-750e1f4bf1de?w=800",
    title: "Các cháu rước đèn",
    year: 2023,
    description: "Video Trung Thu",
    createdAt: "2023-09-29",
  },
  {
    id: "v4",
    type: "video",
    src: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
    thumbnail: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=800",
    title: "Lễ cưới cháu Hương",
    year: 2022,
    description: "Video đám cưới",
    createdAt: "2022-05-20",
  },
];

export const getUniqueYears = (items: MediaItem[]): number[] => {
  const years = [...new Set(items.map((item) => item.year))];
  return years.sort((a, b) => b - a);
};
