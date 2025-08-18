import React from "react";
import {UseFormReturn, FormProvider, FieldValues} from "react-hook-form"

interface FormProps<T extends FieldValues> {
    children : React.ReactNode
    methods: UseFormReturn<T>;
}

export function Form<T extends FieldValues>({children, methods}: FormProps<T>){
    return (
        <FormProvider {...methods}>
            {children}
        </FormProvider>
    )
}