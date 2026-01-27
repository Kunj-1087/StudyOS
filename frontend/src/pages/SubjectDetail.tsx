import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSubject, useUpdateSubject } from '../hooks/useSubjects';
import { useToast } from '../context/ToastContext';
import Button from '../components/Button';
import Input from '../components/Input';

const COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899'];

const SubjectDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addToast } = useToast();

    const { data: subject, isLoading, error } = useSubject(id);
    const updateMutation = useUpdateSubject();

    const [isEditing, setIsEditing] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm<{ name: string; color: string }>();

    // Initialize form when Edit mode starts
    const startEditing = () => {
        if (subject) {
            reset({ name: subject.name, color: subject.color });
            setIsEditing(true);
        }
    };

    const onSubmit = (data: { name: string; color: string }) => {
        if (!id) return;

        updateMutation.mutate({ id, ...data }, {
            onSuccess: () => {
                addToast('Subject updated', 'success');
                setIsEditing(false);
            },
            onError: () => {
                addToast('Failed to update', 'error');
            }
        });
    };

    if (isLoading) return <div className="p-8 text-center animate-pulse">Loading subject...</div>;
    if (error || !subject) return <div className="p-8 text-center text-red-500">Subject not found</div>;

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-gray-500 mb-4">
                <Link to="/" className="hover:text-gray-900">Dashboard</Link>
                <span className="mx-2">/</span>
                <span className="font-semibold text-gray-900">{subject.name}</span>
            </div>

            {/* Header Area */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                {!isEditing ? (
                    // VIEW MODE
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div
                                className="w-10 h-10 rounded-full shadow-inner"
                                style={{ backgroundColor: subject.color }}
                            ></div>
                            <h1 className="text-3xl font-bold text-gray-900">{subject.name}</h1>
                        </div>
                        <Button variant="secondary" onClick={startEditing}>
                            Edit Subject
                        </Button>
                    </div>
                ) : (
                    // EDIT MODE
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Edit Subject</h2>
                        </div>

                        <Input
                            label="Subject Name"
                            error={errors.name?.message}
                            {...register('name', { required: 'Name is required' })}
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Color Label</label>
                            <div className="flex gap-2 flex-wrap">
                                {COLORS.map(c => (
                                    <label key={c} className="cursor-pointer">
                                        <input
                                            type="radio"
                                            value={c}
                                            className="sr-only peer"
                                            {...register('color', { required: 'Color is required' })}
                                        />
                                        <div className="w-8 h-8 rounded-full ring-2 ring-transparent peer-checked:ring-offset-1 peer-checked:ring-gray-400 peer-checked:scale-110 transition-transform"
                                            style={{ backgroundColor: c }}
                                        ></div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button type="submit" isLoading={updateMutation.isPending}>
                                Save Changes
                            </Button>
                            <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                )}
            </div>

            {/* Content Placeholder for later (Resources) */}
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-12 text-center text-gray-400">
                <p className="text-lg font-medium">Resources area coming soon</p>
                <p className="text-sm">Link PDFs, Videos, and Notes here.</p>
            </div>
        </div>
    );
};

export default SubjectDetail;
