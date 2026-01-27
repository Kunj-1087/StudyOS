import prisma from '../db/client';
import { Prisma } from '@prisma/client';

export const createSubject = async (data: Prisma.SubjectCreateInput) => {
    return prisma.subject.create({ data });
};

interface FindSubjectsOptions {
    userId: string;
    skip: number;
    take: number;
    search?: string;
    sortBy: 'name' | 'createdAt';
    sortDir: 'asc' | 'desc';
}

export const findSubjects = async ({ userId, skip, take, search, sortBy, sortDir }: FindSubjectsOptions) => {
    const where: Prisma.SubjectWhereInput = {
        userId,
        ...(search ? { name: { contains: search, mode: 'insensitive' } } : {}),
    };

    const [data, total] = await prisma.$transaction([
        prisma.subject.findMany({
            where,
            skip,
            take,
            orderBy: { [sortBy]: sortDir },
        }),
        prisma.subject.count({ where }),
    ]);

    return { data, total };
};

export const findSubjectById = async (id: string, userId: string) => {
    return prisma.subject.findUnique({ where: { id, userId } });
};

export const updateSubject = async (id: string, data: Prisma.SubjectUpdateInput) => {
    return prisma.subject.update({ where: { id }, data });
};

export const deleteSubject = async (id: string) => {
    return prisma.subject.delete({ where: { id } });
};
