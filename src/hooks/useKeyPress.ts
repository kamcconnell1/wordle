import { useEffect, useState } from 'react';
import { KEYS } from '../components/Keyboard';

export const useKeyPress = (): string | null => {
  const [key, setKey] = useState<string | null>(null);

  const downHandler = ({ key }: { key: string }) => {
    const validKeys = [...KEYS].reduce((acc, keys) => [...acc, ...keys.split('')], [] as string[]);
    if (key === 'Enter' || key === 'Backspace' || validKeys.includes(key)) {
      setKey(key);
    }
  };

  const upHandler = () => setKey(null);

  useEffect(() => {
    document.addEventListener('keydown', downHandler);
    document.addEventListener('keyup', upHandler);

    return () => {
      document.removeEventListener('keydown', downHandler);
      document.removeEventListener('keyup', upHandler);
    };
  });

  return key;
};
