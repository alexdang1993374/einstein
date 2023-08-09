import { UseFormReturn } from "react-hook-form";

import { IOption } from "@/constants/schema";
import { FormControl, FormField, FormItem } from "./ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface FormSelectProps {
  form: UseFormReturn<
    { prompt: string; amount: string; resolution: string },
    any,
    undefined
  >;
  isLoading: boolean;
  options: IOption[];
  name: "prompt" | "amount" | "resolution";
}

const FormSelect = ({ form, isLoading, options, name }: FormSelectProps) => {
  return (
    <FormField
      name={name}
      control={form.control}
      render={({ field }) => (
        <FormItem key={field.name} className="col-span-12 lg:col-span-2">
          <Select
            disabled={isLoading}
            onValueChange={field.onChange}
            value={field.value}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue defaultValue={field.value} />
              </SelectTrigger>
            </FormControl>

            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
};

export default FormSelect;
