import { useState, ChangeEvent } from 'react';

export function useForm<T extends { [key: string]: string }>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  return { values, handleChange, setValues };
}
