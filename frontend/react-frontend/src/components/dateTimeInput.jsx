import { useEffect, useState } from "react";
import { Input } from '@headlessui/react';

export default function DateTimeInput({ value }) {
  const now = new Date();
  const timezoneOffset = now.getTimezoneOffset() * 60000;
  const localISOTime = new Date(now - timezoneOffset).toISOString().slice(0, 16);

  const [dateTime, setDateTime] = useState(localISOTime);

  useEffect(() => {
    if (value) {
      setDateTime(value.slice(0, 16)); // Truncate if it's full ISO string
    }
  }, [value]);

  return (
    <Input 
      type="datetime-local" 
      name="fechaHora" 
      className="border rounded p-2" 
      value={dateTime}
      onChange={(e) => setDateTime(e.target.value)}
    />
  );
}
