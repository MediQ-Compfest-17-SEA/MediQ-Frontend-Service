import { Text } from "../ui/text"


interface FormLabelProps{
    children: React.ReactNode
}

export function FormLabel({children}: FormLabelProps){
    return (
        <Text size="sm" bold>
            {children}
        </Text>

    )
}