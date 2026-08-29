import { useDebouncedControlledInput } from '@/hooks/useDebounceControlledInput';
import { cn } from '@/lib/utils';
import { type ChangeEvent, type JSX } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

type InputType =
    | 'text'
    | 'number'
    | 'email'
    | 'password'
    | 'date'
    | 'time'
    | 'datetime-local'
    | 'search'
    | 'tel'
    | 'url'
    | 'textarea';

type InputFieldProps = {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: InputType;
    className?: string;
    delayInMs?: number;
    placeholder?: string;
};

const DEFAULT_DELAY_IN_MS = 300;

const InputField = ({
    id,
    label,
    value,
    type = 'text',
    onChange,
    className,
    placeholder,
    delayInMs = DEFAULT_DELAY_IN_MS,
}: InputFieldProps): JSX.Element => {
    const { localValue, setLocalValue } = useDebouncedControlledInput(value, onChange, delayInMs);

    const handleChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ): void => {
        setLocalValue(event.target.value);
    };

    return (
        <div className={cn('space-y-2', className)}>
            <Label htmlFor={id}>{label}</Label>
            {type === 'textarea' ? (
                <Textarea id={id} value={localValue} onChange={handleChange} placeholder={placeholder} />
            ) : (
                <Input id={id} type={type} value={localValue} onChange={handleChange} placeholder={placeholder} />
            )}
        </div>
    );
};

export default InputField;
