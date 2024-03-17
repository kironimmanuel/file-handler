import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteFile } from '../../services/file.api';

export const useDeleteFile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (fileId: string) => deleteFile(fileId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['files'] });
        },
    });
};
