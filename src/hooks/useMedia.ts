import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getMediaList,
    getMediaByYear,
    uploadMedia,
    updateMedia,
    downloadMedia,
    deleteMedia,
    MediaItem,
    UploadMediaParams,
} from '../services/media';

/**
 * Hook to fetch all media
 */
export const useMediaList = (type?: 'image' | 'video') => {
    return useQuery({
        queryKey: ['media', type],
        queryFn: () => {
            const result = getMediaList(type);
            console.log('[useMediaList] Query result:', result.length, 'items');
            return result;
        },
        initialData: () => getMediaList(type), // Provide initial data immediately
        staleTime: 0, // Always refetch
    });
};

/**
 * Hook to fetch media by year
 */
export const useMediaByYear = (year: number | null, type?: 'image' | 'video') => {
    return useQuery({
        queryKey: ['media', 'year', year, type],
        queryFn: () => {
            let result: MediaItem[];
            if (year === null) {
                result = getMediaList(type);
            } else {
                result = getMediaByYear(year, type);
            }
            console.log('[useMediaByYear] Query result:', result.length, 'items');
            return result;
        },
        initialData: () => {
            // Provide initial data immediately
            if (year === null) {
                return getMediaList(type);
            }
            return getMediaByYear(year, type);
        },
        staleTime: 0, // Always refetch
    });
};

/**
 * Hook to upload media
 */
export const useUploadMedia = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (params: UploadMediaParams) => uploadMedia(params),
        onSuccess: () => {
            // Invalidate all media queries to refetch
            queryClient.invalidateQueries({ queryKey: ['media'] });
        },
    });
};

/**
 * Hook to update media
 */
export const useUpdateMedia = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: Partial<MediaItem> }) =>
            updateMedia(id, updates),
        onSuccess: () => {
            // Invalidate all media queries to refetch
            queryClient.invalidateQueries({ queryKey: ['media'] });
        },
    });
};

/**
 * Hook to download media
 */
export const useDownloadMedia = () => {
    return useMutation({
        mutationFn: (media: MediaItem) => downloadMedia(media),
    });
};

/**
 * Hook to delete media
 */
export const useDeleteMedia = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (media: MediaItem) => deleteMedia(media),
        onSuccess: () => {
            // Invalidate all media queries to refetch
            queryClient.invalidateQueries({ queryKey: ['media'] });
        },
    });
};
