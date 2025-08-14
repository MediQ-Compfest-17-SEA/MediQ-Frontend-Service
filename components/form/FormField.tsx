import React from "react";
import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";
import { VStack } from "../ui/vstack";

interface FormFieldProps<T extends FieldValues> {
  name: Path<T>;
  render: (props: { value: any; onChange: (value: any) => void; onBlur: () => void }) => React.ReactNode;
}

export function FormField<T extends FieldValues>({ name, render }: FormFieldProps<T>) {
  const { control } = useFormContext<T>();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <VStack space="xs">
          {render({
            value: field.value,
            onChange: field.onChange,
            onBlur: field.onBlur,
          })}
        </VStack>
      )}
    />
  );
}
