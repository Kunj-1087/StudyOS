import React from 'react';
import { useFormContext } from 'react-hook-form';
import Input from '../Input';

// Get props type from the Input component (assuming Input forwardRef)
type InputProps = React.ComponentProps<typeof Input>;

interface InputFieldProps extends Omit<InputProps, 'name' | 'error'> {
    name: string;
}

export const InputField: React.FC<InputFieldProps> = ({ name, ...props }) => {
    const { register, formState: { errors } } = useFormContext();

    // Lodash get style access for nested errors could be added here, 
    // but for flat forms simple access works.
    const error = errors[name]?.message as string | undefined;

    return (
        <Input
            {...props}
            error={error}
            {...register(name)}
        />
    );
};
