import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import { useToast } from '../context/ToastContext';

const registerSchema = z.object({
    displayName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema)
    });

    const navigate = useNavigate();
    const { addToast } = useToast();

    const onSubmit = async (data: RegisterFormData) => {
        try {
            // TODO: Call Firebase Signup
            console.log('Register Data:', data);
            await new Promise(resolve => setTimeout(resolve, 1000));

            addToast('Account created successfully!', 'success');
            navigate('/');
        } catch (error) {
            addToast('Failed to create account.', 'error');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            Sign in
                        </Link>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <Input
                            label="Full Name"
                            type="text"
                            autoComplete="name"
                            error={errors.displayName?.message}
                            {...register('displayName')}
                        />
                        <Input
                            label="Email address"
                            type="email"
                            autoComplete="email"
                            error={errors.email?.message}
                            {...register('email')}
                        />
                        <Input
                            label="Password"
                            type="password"
                            autoComplete="new-password"
                            error={errors.password?.message}
                            {...register('password')}
                        />
                        <Input
                            label="Confirm Password"
                            type="password"
                            autoComplete="new-password"
                            error={errors.confirmPassword?.message}
                            {...register('confirmPassword')}
                        />
                    </div>

                    <div>
                        <Button
                            type="submit"
                            className="w-full"
                            isLoading={isSubmitting}
                        >
                            Sign up
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
