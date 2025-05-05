import { useState } from "react";
import Board from "./components/Board";
import ControlPanel from "./components/ControlPanel";
import BoardInput from "./components/BoardInput";

const finalState = [1, 2, 3, 4, 5, 6, 7, 8, -1];

function App() {
  const [boardState, setBoardState] = useState(finalState);
  const [isEditing, setIsEditing] = useState(false);
  const [isSolving, setIsSolving] = useState(false);

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
        boardState={boardState}
        setBoardState={setBoardState}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        isSolving={isSolving}
        setIsSolving={setIsSolving}
      />
    </div>
  );
}

export default App;
