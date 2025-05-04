import { useState, useEffect } from "react";

interface BoardProps {
  n: number;
  boardState: number[];
}

function Board({ n, boardState }: BoardProps) {
  const [boardSize, setBoardSize] = useState<number>(n);

  useEffect(() => {
    setBoardSize(n);
  }, [n]);

  return (
    <div
      className={`grid ${
        boardSize === 3 ? "grid-cols-3" : "grid-cols-4"
      } gap-1 w-[50vw] aspect-square mx-auto mb-14`}
    >
      {boardState.map((t) => {
        if (t === -1) {
          return (
            <div
              key={t}
              className="rounded-sm h-full w-full flex items-center justify-center"
            ></div>
          );
        }

        return (
          <div
            key={t}
            className="border rounded-sm h-full w-full flex items-center justify-center bg-slate-700 text-2xl text-bold"
          >
            {t}
          </div>
        );
      })}
    </div>
  );
}

export default Board;
