import { FormProps } from "@/Interfaces/IForm";
import React from "react";
import {UseFormReturn, FormProvider, FieldValues} from "react-hook-form"


export function Form<T extends FieldValues>({children, methods}: FormProps<T>){
    return (
        <FormProvider {...methods}>
            {children}
        </FormProvider>
    )
}