import React from "react";
import { useFormContext } from "react-hook-form";
import { Text } from "../ui/text";

interface FormMessageProps {
  name: string;
}

export function FormMessage({ name }: FormMessageProps) {
  const {
    formState: { errors },
  } = useFormContext();

  const error = errors[name];
  if (!error) return null;

  return (
    <Text className="text-red-500 text-xs mt-1">
      {error.message as string}
    </Text>
  );
}
