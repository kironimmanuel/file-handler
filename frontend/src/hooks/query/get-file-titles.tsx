import { useQuery } from '@tanstack/react-query';
import { getFileTitles } from '../../services/file.api';

export const useGetFileTitles = () => {
    return useQuery({
        queryKey: ['files'],
        queryFn: getFileTitles,
    });
};
