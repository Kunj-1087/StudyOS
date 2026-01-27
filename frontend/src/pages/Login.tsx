import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Added useLocation
import { useToast } from '../context/ToastContext';
import Button from '../components/Button';
import { Form } from '../components/form/Form';
import { InputField } from '../components/form/InputField';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema)
    });

    const navigate = useNavigate();
    const location = useLocation();
    const { addToast } = useToast();

    const from = location.state?.from?.pathname || "/";

    const onSubmit = async (data: LoginFormData) => {
        try {
            console.log('Login Data:', data);
            await new Promise(resolve => setTimeout(resolve, 1000));
            addToast('Logged in successfully!', 'success');
            navigate(from, { replace: true }); // Redirect to original destination
        } catch (error) {
            addToast('Failed to login.', 'error');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in
                    </h2>
                    {/* ... existing markup ... */}
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Or{' '}
                        <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                            create a new account
                        </Link>
                    </p>
                </div>

                <Form form={form} onSubmit={onSubmit} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <InputField
                            name="email"
                            label="Email address"
                            type="email"
                            autoComplete="email"
                        />
                        <InputField
                            name="password"
                            label="Password"
                            type="password"
                            autoComplete="current-password"
                        />
                    </div>

                    {/* ... existing link ... */}
                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                                Forgot your password?
                            </Link>
                        </div>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            className="w-full"
                            isLoading={form.formState.isSubmitting}
                        >
                            Sign in
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default Login;
