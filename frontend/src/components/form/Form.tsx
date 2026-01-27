import React from 'react';
import { FormProvider, UseFormReturn, FieldValues, SubmitHandler } from 'react-hook-form';

interface FormProps<T extends FieldValues> {
    form: UseFormReturn<T>;
    onSubmit: SubmitHandler<T>;
    children: React.ReactNode;
    className?: string;
}

export const Form = <T extends FieldValues>({ form, onSubmit, children, className }: FormProps<T>) => {
    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={className} noValidate>
                {children}
            </form>
        </FormProvider>
    );
};
