import { useState } from "react";
import Board from "./components/Board";
import ControlPanel from "./components/ControlPanel";

const finalState = [1, 2, 3, 4, 5, 6, 7, 8, -1];

function App() {
  const [boardState, setBoardState] = useState(finalState);
  return (
    <div className="w-screen h-screen p-5 md:px-[20%] flex flex-col gap-y-4">
      <Board
        n={Math.ceil(Math.sqrt(boardState.length))}
        boardState={boardState}
      />
      <ControlPanel
        n={Math.ceil(Math.sqrt(boardState.length))}
        setBoardState={setBoardState}
      />
    </div>
  );
}

export default App;
