import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import { useToast } from '../context/ToastContext';

const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
});

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword: React.FC = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordData>({
        resolver: zodResolver(forgotPasswordSchema)
    });

    const { addToast } = useToast();

    const onSubmit = async (data: ForgotPasswordData) => {
        try {
            // TODO: Firebase reset password
            console.log('Reset Email:', data);
            await new Promise(resolve => setTimeout(resolve, 1000));

            addToast('Password reset email sent!', 'info');
        } catch (error) {
            addToast('Failed to send reset email.', 'error');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Reset Password
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Enter your email to receive reset instructions
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <Input
                        label="Email address"
                        type="email"
                        autoComplete="email"
                        error={errors.email?.message}
                        {...register('email')}
                    />

                    <div>
                        <Button
                            type="submit"
                            className="w-full"
                            isLoading={isSubmitting}
                        >
                            Send Reset Link
                        </Button>
                    </div>

                    <div className="text-center">
                        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            Back to Sign in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
