import { Dispatch, SetStateAction, useRef } from "react";
import randomOrderGenerator from "../utils/randomOrderGenerator";
import {
  AStarManhattan,
  AStarMisplacedTile,
  UniformCostSearch,
} from "../utils/algorithms";

interface ControlPanelProps {
  n: number;
  initialState: number[];
  setInitialState: Dispatch<SetStateAction<number[]>>;
  boardState: number[];
  setBoardState: Dispatch<SetStateAction<number[]>>;
  isEditing: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  isSolving: boolean;
  setIsSolving: Dispatch<SetStateAction<boolean>>;
  size: number;
  setSize: Dispatch<SetStateAction<number>>;
}

function ControlPanel({
  n,
  initialState,
  setInitialState,
  boardState,
  setBoardState,
  isEditing,
  setIsEditing,
  isSolving,
  setIsSolving,
  size,
  setSize,
}: ControlPanelProps) {
  const algRef = useRef<HTMLSelectElement>(null);

  const solvePuzzle = () => {
    setIsSolving(true);
    setInitialState(boardState);
    console.clear();
    console.log("Solving...");
    const algorithm = algRef.current?.value;

    if (!algorithm) {
      setIsSolving(false);
      console.log("Please select an algorithm");
      return;
    }

    let result;
    let title = "";
    if (algorithm === "ucs") {
      title = "Uniform Cost Search";
      result = UniformCostSearch(boardState);
    } else if (algorithm === "misplaced") {
      title = "A* search with Misplaced Tile";
      result = AStarMisplacedTile(boardState);
    } else if (algorithm === "manhattan") {
      title = "A* search with Manhattan Distance";
      result = AStarManhattan(boardState);
    }

    console.log(title);
    console.log(`Expanded: ${result?.expandedNodes}`);
    console.log(`Depth:    ${result?.solutionDepth}`);
    console.log("Solved");

    result?.solutionPath.forEach((state, index, array) => {
      setTimeout(() => {
        if (index === array.length - 1) {
          setIsSolving(false);
        }
        setBoardState([...state]);
      }, 300 * (index + 1));
    });
  };

  return (
    <form className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-4 w-full justify-center">
        <select
          className="col-span-1 outline outline-cyan-500 text-cyan-200 disabled:outline-gray-500 disabled:text-gray-500 disabled:cursor-not-allowed border-x-8 border-transparent rounded-lg p-2"
          onChange={(e) => {
            if (e.target.value) {
              setSize(Number(e.target.value));
            }
          }}
        >
          <option value={9}>8-puzzle</option>
          <option value={16}>15-puzzle</option>
          <option value={25}>24-puzzle</option>
        </select>
        <button
          className="p-2 rounded-lg cursor-pointer border text-amber-300 border-amber-300 disabled:border-gray-500 disabled:text-gray-500 disabled:cursor-not-allowed"
          onClick={(e) => {
            e.preventDefault();
            const arr = randomOrderGenerator(n);
            setBoardState([...arr]);
            setInitialState([...arr]);
          }}
          disabled={isSolving}
        >
          Random Combination
        </button>
        {!isEditing && (
          <button
            className="p-2 rounded-lg cursor-pointer border border-teal-300 disabled:border-gray-500 disabled:text-gray-500 disabled:cursor-not-allowed text-teal-200"
            onClick={(e) => {
              e.preventDefault();
              setIsEditing(!isEditing);
            }}
            disabled={isSolving}
          >
            Custom Input
          </button>
        )}
      </div>
      <div className="grid grid-cols-3 gap-4">
        <select
          className="col-span-1 outline outline-emerald-500 text-emerald-200 disabled:outline-gray-500 disabled:text-gray-500 disabled:cursor-not-allowed border-x-8 border-transparent rounded-lg p-2"
          disabled={size !== 9 || isSolving}
          ref={algRef}
        >
          <option value="">Select an algorithm</option>
          <option value="ucs">Uniform Cost Search</option>
          <option value="misplaced">A* (Misplaced Tile)</option>
          <option value="manhattan">A* (Manhattan Distance)</option>
        </select>
        <button
          className="outline rounded-lg bg-emerald-500 text-neutral-900 cursor-pointer disabled:bg-emerald-800 disabled:cursor-not-allowed"
          disabled={size !== 9 || isSolving}
          onClick={(e) => {
            e.preventDefault();
            solvePuzzle();
          }}
        >
          {isSolving ? <p className="animate-pulse">Solving</p> : "Solve"}
        </button>
        <button
          className="outline rounded-lg bg-rose-500 text-neutral-900 cursor-pointer disabled:bg-rose-800 disabled:cursor-not-allowed"
          disabled={
            size !== 9 ||
            isSolving ||
            initialState.join(",") === boardState.join(",")
          }
          onClick={(e) => {
            e.preventDefault();
            setBoardState(initialState);
          }}
        >
          Reset
        </button>
      </div>
      {size !== 9 && <p>Solving disabled due to memory constraints</p>}
    </form>
  );
}

export default ControlPanel;
