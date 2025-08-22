import { FormProps } from "@/Interfaces/IForm";
import React from "react";
import {FormProvider, FieldValues} from "react-hook-form"


export function Form<T extends FieldValues>({children, methods}: FormProps<T>){
    return (
        <FormProvider {...methods}>
            {children}
        </FormProvider>
    )
}