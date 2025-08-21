import React from "react";
import {UseFormReturn, FieldValues, Path} from "react-hook-form"

export interface FormProps<T extends FieldValues> {
    children : React.ReactNode
    methods: UseFormReturn<T>;
}


export interface FormFieldProps<T extends FieldValues> {
  name: Path<T>;
  render: (props: { value: any; onChange: (value: any) => void; onBlur: () => void }) => React.ReactNode;
}

export interface FormLabelProps{
    children: React.ReactNode
}
export interface FormMessageProps {
  name: string;
}