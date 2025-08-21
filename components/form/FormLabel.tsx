import { FormLabelProps } from "@/Interfaces/IForm"
import { Text } from "../ui/text"




export function FormLabel({children}: FormLabelProps){
    return (
        <Text size="sm" bold>
            {children}
        </Text>

    )
}