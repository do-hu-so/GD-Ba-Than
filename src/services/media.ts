import { uploadFile, downloadFile, MediaMetadata, getCloudinaryFiles, getCloudinaryUrl } from './storage';

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  src: string;
  thumbnail?: string;
  title: string;
  year: number;
  description?: string;
  uploadedBy?: string;
  createdAt: string;
  fileSize?: number;
  mimeType?: string;
  likes?: number; // Number of likes
}

export interface UploadMediaParams {
  file: File;
  title: string;
  year: number;
  description?: string;
  uploadedBy?: string;
  onProgress?: (progress: number) => void;
}

// In-memory storage for uploaded media
// In production, you'd fetch this from Cloudinary Admin API or your own backend
let mediaStore: MediaItem[] = [];

/**
 * Upload media (file + metadata) to Cloudinary
 */
export const uploadMedia = async (params: UploadMediaParams): Promise<MediaItem> => {
  const { file, title, year, description, uploadedBy, onProgress } = params;

  try {
    // Upload file to Cloudinary with metadata
    const uploadResult = await uploadFile(
      file,
      { title, year, description, uploadedBy },
      onProgress
    );

    // Create MediaItem
    const mediaItem: MediaItem = {
      id: uploadResult.publicId,
      type: uploadResult.resourceType,
      src: uploadResult.secureUrl,
      thumbnail: uploadResult.thumbnailUrl || uploadResult.secureUrl,
      title,
      description,
      year,
      uploadedBy,
      createdAt: new Date().toISOString(),
      fileSize: uploadResult.bytes,
      mimeType: file.type,
      likes: 0, // Initialize with 0 likes
    };

    // Store in memory
    mediaStore.push(mediaItem);

    // Also save to localStorage for persistence
    saveToLocalStorage();

    return mediaItem;
  } catch (error) {
    console.error('Error uploading media:', error);
    throw error;
  }
};

/**
 * Update media item
 */
export const updateMedia = async (id: string, updates: Partial<MediaItem>): Promise<MediaItem> => {
  try {
    const index = mediaStore.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Media item not found');
    }

    // Update item
    const updatedItem = { ...mediaStore[index], ...updates };
    mediaStore[index] = updatedItem;

    // Save to localStorage
    saveToLocalStorage();

    return updatedItem;
  } catch (error) {
    console.error('Error updating media:', error);
    throw error;
  }
};

/**
 * Get media list (filtered by type)
 */
export const getMediaList = (type?: 'image' | 'video'): MediaItem[] => {
  // Always load from localStorage to ensure fresh data
  loadFromLocalStorage();

  if (!type) {
    return [...mediaStore]; // Return a copy
  }

  const filtered = mediaStore.filter(item => item.type === type);
  return filtered;
};

/**
 * Get media by year
 */
export const getMediaByYear = (year: number, type?: 'image' | 'video'): MediaItem[] => {
  const allMedia = getMediaList(type);
  return allMedia.filter(item => item.year === year);
};

/**
 * Download media to local device
 */
export const downloadMedia = async (media: MediaItem): Promise<void> => {
  try {
    const extension = media.mimeType?.split('/')[1] || (media.type === 'video' ? 'mp4' : 'jpg');
    const filename = `${media.title}_${media.year}.${extension}`;
    await downloadFile(media.src, filename);
  } catch (error) {
    console.error('Error downloading media:', error);
    throw error;
  }
};

/**
 * Delete media
 */
export const deleteMedia = async (media: MediaItem): Promise<void> => {
  // Remove from memory store
  mediaStore = mediaStore.filter(item => item.id !== media.id);
  saveToLocalStorage();

  // Note: Deleting from Cloudinary requires backend
  console.log('Media removed from local storage. Cloudinary file still exists.');
};

/**
 * Save media store to localStorage
 */
const saveToLocalStorage = () => {
  try {
    localStorage.setItem('family_media_store', JSON.stringify(mediaStore));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * Load media store from localStorage
 */
const loadFromLocalStorage = () => {
  try {
    const stored = localStorage.getItem('family_media_store');
    if (stored) {
      mediaStore = JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    mediaStore = [];
  }
};

// Initialize on module load
loadFromLocalStorage();

/**
 * Toggle like for a media item
 */
export const toggleLike = (mediaId: string, isLiked: boolean): number => {
  const media = mediaStore.find(item => item.id === mediaId);
  if (!media) return 0;

  if (isLiked) {
    // Unlike
    media.likes = Math.max(0, (media.likes || 0) - 1);
  } else {
    // Like
    media.likes = (media.likes || 0) + 1;
  }

  saveToLocalStorage();
  return media.likes;
};

/**
 * Get likes for a media item
 */
export const getLikes = (mediaId: string): number => {
  const media = mediaStore.find(item => item.id === mediaId);
  return media?.likes || 0;
};

/**
 * Check if user has liked a media item
 * Uses localStorage to track user's likes
 */
export const isLikedByUser = (mediaId: string): boolean => {
  try {
    const userLikes = localStorage.getItem('user_likes');
    if (!userLikes) return false;
    const likes: string[] = JSON.parse(userLikes);
    return likes.includes(mediaId);
  } catch (error) {
    return false;
  }
};

/**
 * Set user's like status for a media item
 */
export const setUserLike = (mediaId: string, liked: boolean): void => {
  try {
    const userLikes = localStorage.getItem('user_likes');
    let likes: string[] = userLikes ? JSON.parse(userLikes) : [];

    if (liked) {
      if (!likes.includes(mediaId)) {
        likes.push(mediaId);
      }
    } else {
      likes = likes.filter(id => id !== mediaId);
    }

    localStorage.setItem('user_likes', JSON.stringify(likes));
  } catch (error) {
    console.error('Error setting user like:', error);
  }
};

/**
 * Sync media with Cloudinary
 * Fetches latest list from Cloudinary and merges with local store
 */
export const syncWithCloudinary = async () => {
  console.log('Syncing with Cloudinary...');
  try {
    const [images, videos] = await Promise.all([
      getCloudinaryFiles('image'),
      getCloudinaryFiles('video')
    ]);

    const allResources = [...(images || []), ...(videos || [])];
    console.log(`Found ${allResources.length} resources from Cloudinary`);

    if (allResources.length === 0) return;

    let hasChanges = false;
    const newItems: MediaItem[] = [];

    allResources.forEach(res => {
      // Check if exists
      const exists = mediaStore.some(item => item.id === res.public_id);

      if (!exists) {
        // Parse context/metadata
        const context = res.context?.custom || {};
        const title = context.title || "Gia đình";
        const year = parseInt(context.year) || new Date(res.created_at).getFullYear();

        // Create new item
        const newItem: MediaItem = {
          id: res.public_id,
          type: res.format === 'mp4' || res.format === 'mov' || res.resource_type === 'video' ? 'video' : 'image',
          src: getCloudinaryUrl(res.public_id, res.resource_type, res.version),
          // For videos, try to guess thumbnail (Cloudinary specific)
          thumbnail: res.resource_type === 'video'
            ? getCloudinaryUrl(res.public_id, 'video', res.version).replace(/\.[^/.]+$/, ".jpg")
            : getCloudinaryUrl(res.public_id, 'image', res.version),
          title: title,
          year: year,
          description: context.description || '',
          uploadedBy: context.uploadedBy || 'Cloud',
          createdAt: res.created_at,
          fileSize: res.bytes,
          mimeType: res.format ? `${res.resource_type}/${res.format}` : undefined,
          likes: 0
        };

        newItems.push(newItem);
        hasChanges = true;
      }
    });

    if (hasChanges) {
      console.log(`Adding ${newItems.length} new items from Cloudinary`);
      mediaStore = [...mediaStore, ...newItems].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      saveToLocalStorage();
    }
  } catch (error) {
    console.error('Failed to sync with Cloudinary:', error);
  }
};

// Start sync on load
syncWithCloudinary();
