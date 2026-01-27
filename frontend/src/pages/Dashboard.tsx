import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSubjects, useCreateSubject } from '../hooks/useSubjects';
import SubjectCard from '../components/SubjectCard';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import { useToast } from '../context/ToastContext';

const Dashboard: React.FC = () => {
    const { data: subjects, isLoading, error } = useSubjects();
    const createSubjectMutation = useCreateSubject();
    const { addToast } = useToast();

    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<{ name: string; color: string }>();

    // Optimize Filter: Only re-calc when subjects or searchTerm changes
    const filteredSubjects = React.useMemo(() => {
        return subjects?.filter(subject =>
            subject.name.toLowerCase().includes(searchTerm.toLowerCase())
        ) || [];
    }, [subjects, searchTerm]);

    const onSubmit = (data: { name: string; color: string }) => {
        createSubjectMutation.mutate(data, {
            onSuccess: () => {
                addToast('Subject created!', 'success');
                setIsModalOpen(false);
                reset();
            },
            onError: () => {
                addToast('Failed to create subject.', 'error');
            }
        });
    };

    const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899'];

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">My Subjects</h1>
                <div className="flex w-full sm:w-auto gap-2">
                    <Input
                        placeholder="Search subjects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-64"
                    />
                    <Button onClick={() => setIsModalOpen(true)}>
                        + New Subject
                    </Button>
                </div>
            </div>

            {/* Grid Content */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Skeletons */}
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-40 bg-gray-100 rounded-lg animate-pulse"></div>
                    ))}
                </div>
            ) : error ? (
                <div className="text-red-500 text-center py-10">
                    Failed to load subjects. Please try again.
                </div>
            ) : filteredSubjects?.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-500 mb-4">No subjects found.</p>
                    <Button variant="secondary" onClick={() => setIsModalOpen(true)}>Create your first subject</Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSubjects?.map(subject => (
                        <SubjectCard
                            key={subject.id}
                            id={subject.id}
                            name={subject.name}
                            color={subject.color}
                            taskCount={3} // Mock
                        />
                    ))}
                </div>
            )}

            {/* Create Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create New Subject"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Subject Name"
                        placeholder="e.g. Calculus"
                        error={errors.name?.message}
                        {...register('name', { required: 'Name is required' })}
                        autoFocus
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Color Label</label>
                        <div className="flex gap-2 flex-wrap">
                            {colors.map(c => (
                                <label key={c} className="cursor-pointer">
                                    <input
                                        type="radio"
                                        value={c}
                                        className="sr-only peer"
                                        {...register('color', { required: 'Color is required' })}
                                    />
                                    <div className="w-8 h-8 rounded-full ring-2 ring-transparent peer-checked:ring-offset-1 peer-checked:ring-gray-400 hover:scale-110 transition-transform"
                                        style={{ backgroundColor: c }}
                                    ></div>
                                </label>
                            ))}
                        </div>
                        {errors.color && <p className="text-sm text-red-600 mt-1">{errors.color.message}</p>}
                    </div>

                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                        <Button type="submit" className="w-full sm:col-start-2" isLoading={createSubjectMutation.isPending}>
                            Create
                        </Button>
                        <Button type="button" variant="secondary" className="mt-3 w-full sm:mt-0 sm:col-start-1" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Dashboard;
