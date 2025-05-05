import { useEffect, useState } from "react";
import Board from "./components/Board";
import ControlPanel from "./components/ControlPanel";
import BoardInput from "./components/BoardInput";

function App() {
  const [boardState, setBoardState] = useState<number[]>([]);
  const [initialState, setInitialState] = useState(boardState);
  const [isEditing, setIsEditing] = useState(false);
  const [isSolving, setIsSolving] = useState(false);
  const [size, setSize] = useState(9);

  useEffect(() => {
    const goalState = Array.from({ length: size - 1 }, (_, i) => i + 1);
    goalState.push(-1);
    setBoardState([...goalState]);
  }, [size]);

  return (
    <div className="w-screen min-h-screen p-5 md:px-[20%] flex flex-col gap-y-4">
      <div className="absolute top-0 left-0 w-full py-2 bg-gray-300 text-neutral-950 text-center font-bold">
        For logs, open the console (Ctrl+Shift+J / Cmd+Option+J)
      </div>
      <div className="h-10" />
      {isEditing ? (
        <BoardInput
          n={Math.ceil(Math.sqrt(boardState.length))}
          boardState={boardState}
          setInitialState={setInitialState}
          setBoardState={setBoardState}
          setIsEditing={setIsEditing}
        />
      ) : (
        <Board
          n={Math.ceil(Math.sqrt(boardState.length))}
          boardState={boardState}
        />
      )}
      <ControlPanel
        n={Math.ceil(Math.sqrt(boardState.length))}
        initialState={initialState}
        setInitialState={setInitialState}
        boardState={boardState}
        setBoardState={setBoardState}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        isSolving={isSolving}
        setIsSolving={setIsSolving}
        size={size}
        setSize={setSize}
      />
    </div>
  );
}

export default App;
