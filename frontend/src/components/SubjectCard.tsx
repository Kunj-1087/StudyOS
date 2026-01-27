import React from 'react';
import { Link } from 'react-router-dom';

interface SubjectCardProps {
    id: string;
    name: string;
    color: string;
    taskCount?: number;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ id, name, color, taskCount = 0 }) => {
    return (
        <Link
            to={`/subjects/${id}`}
            className="block p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
        >
            <div className="flex items-center justify-between mb-4">
                <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl"
                    style={{ backgroundColor: color }}
                >
                    {name.charAt(0).toUpperCase()}
                </div>
                <span className="text-gray-400 group-hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </span>
            </div>
            <h5 className="mb-1 text-xl font-bold tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors">
                {name}
            </h5>
            <p className="font-normal text-gray-700">
                {taskCount} active tasks
            </p>
        </Link>
    );
};

export default SubjectCard;
