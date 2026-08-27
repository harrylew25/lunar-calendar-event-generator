import { cn } from "@/lib/utils";
import { Label } from "./label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "./select";

export type SelectFieldOption = {
    label: string;
    value: string;
}

interface SelectFieldProps {
    id: string;
    label: string;
    value: string;
    onValueChange: (value: string) => void;
    options: SelectFieldOption[];
    className?: string;
}

const SelectField = ({ id, label, value, onValueChange, options, className }: SelectFieldProps) => {

    return (<div className={cn("space-y-2", className)}>
        <Label htmlFor={id}>{label}</Label>
        <Select
            value={value}
            onValueChange={onValueChange}>
            <SelectTrigger id={id} className="w-full max-w-xs">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    </div>)
};

export default SelectField;