import { useState } from 'react';

export const useSetup = () => {
  const [players, setPlayers] = useState<string[]>([]);

  const addPlayer = (name: string) => setPlayers((prev) => [...prev, name]);
  const resetPlayers = () => setPlayers([]);

  return { players, addPlayer, resetPlayers };
};
