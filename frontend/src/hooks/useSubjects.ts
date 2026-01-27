import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API } from '../services/api';
import { SubjectSchema } from 'studyos-shared';
import { z } from 'zod';

type Subject = {
    id: string;
    name: string;
    color: string;
    userId: string;
};

// Mock Data Store (in-memory for session)
let MOCK_DATA = [
    { id: '1', name: 'Calculus', color: '#EF4444', userId: '1' },
    { id: '2', name: 'World History', color: '#3B82F6', userId: '1' },
    { id: '3', name: 'Chemistry', color: '#10B981', userId: '1' },
];

export const useSubjects = () => {
    return useQuery({
        queryKey: ['subjects'],
        queryFn: async () => {
            await new Promise(r => setTimeout(r, 500));
            return MOCK_DATA;
        }
    });
};

export const useSubject = (id: string | undefined) => {
    return useQuery({
        queryKey: ['subjects', id],
        enabled: !!id,
        queryFn: async () => {
            await new Promise(r => setTimeout(r, 500));
            const subject = MOCK_DATA.find(s => s.id === id);
            if (!subject) throw new Error("Subject not found");
            return subject;
        }
    });
}

export const useCreateSubject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newSubject: { name: string; color: string }) => {
            console.log("Mock Creating:", newSubject);
            const created = { id: Date.now().toString(), ...newSubject, userId: '1' };
            MOCK_DATA.push(created);
            return created;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['subjects'], (old: Subject[] | undefined) => {
                return old ? [...old, data] : [data];
            });
        }
    });
};

export const useUpdateSubject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (updates: { id: string; name: string; color: string }) => {
            await new Promise(r => setTimeout(r, 500));
            const index = MOCK_DATA.findIndex(s => s.id === updates.id);
            if (index !== -1) {
                MOCK_DATA[index] = { ...MOCK_DATA[index], ...updates };
            }
            return MOCK_DATA[index];
        },
        onMutate: async (newSubject) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['subjects', newSubject.id] });
            await queryClient.cancelQueries({ queryKey: ['subjects'] });

            // Snapshot previous value
            const previousSubject = queryClient.getQueryData(['subjects', newSubject.id]);

            // Optimistic Update Detail
            queryClient.setQueryData(['subjects', newSubject.id], (old: Subject | undefined) => ({
                ...old, ...newSubject
            }));

            // Optimistic Update List
            queryClient.setQueryData(['subjects'], (old: Subject[] | undefined) => {
                return old?.map(s => s.id === newSubject.id ? { ...s, ...newSubject } : s);
            });

            return { previousSubject };
        },
        onError: (err, newTodo, context) => {
            // Rollback
            queryClient.setQueryData(['subjects', newTodo.id], context?.previousSubject);
        },
        onSettled: (data) => {
            if (data) {
                queryClient.invalidateQueries({ queryKey: ['subjects', data.id] });
                queryClient.invalidateQueries({ queryKey: ['subjects'] });
            }
        }
    });
};
