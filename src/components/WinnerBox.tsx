import React from 'react';
import { useDrop } from 'react-dnd';

interface WinnerBoxProps {
  setWinner: (winner: string) => void;
}

const WinnerBox: React.FC<WinnerBoxProps> = ({ setWinner }) => {
  const [{ isOver }, dropRef] = useDrop({
    accept: 'PLAYER',
    drop: (item: { name: string }) => setWinner(item.name),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div ref={dropRef} className={`winner-box ${isOver ? 'highlight' : ''}`}>
      <h3>Arrastra aquí al ganador del torneo</h3>
    </div>
  );
};

export default WinnerBox;
