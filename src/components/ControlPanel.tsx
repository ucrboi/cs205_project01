import { Dispatch, SetStateAction } from "react";
import randomOrderGenerator from "../utils/randomOrderGenerator";
import { UniformCostSearch } from "../utils/algorithms";

interface ControlPanelProps {
  n: number;
  boardState: number[];
  setBoardState: Dispatch<SetStateAction<number[]>>;
  isEditing: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  isSolving: boolean;
  setIsSolving: Dispatch<SetStateAction<boolean>>;
}

function ControlPanel({
  n,
  boardState,
  setBoardState,
  isEditing,
  setIsEditing,
  isSolving,
  setIsSolving,
}: ControlPanelProps) {
  const solvePuzzle = () => {
    setIsSolving(true);
    const result = UniformCostSearch(boardState);
    if (result) {
      console.log(`Expanded: ${result.expandedNodes}`);
      console.log(`Depth:    ${result.solutionDepth}`);
      console.log(`Path:`);
      result.solutionPath.forEach((s) => console.log(s));
    } else {
      console.log("No solution!");
    }
    setIsSolving(false);
  };

  return (
    <form className="flex flex-col gap-6">
      <div className="flex gap-4 w-full justify-center">
        <button
          className="p-2 rounded-lg w-50 cursor-pointer border text-amber-300 border-amber-300 disabled:border-gray-500 disabled:text-gray-500 disabled:cursor-not-allowed"
          onClick={(e) => {
            e.preventDefault();
            const arr = randomOrderGenerator(n);
            setBoardState([...arr]);
          }}
          disabled={isSolving}
        >
          Random Combination
        </button>
        {!isEditing && (
          <button
            className="p-2 rounded-lg w-50 cursor-pointer border border-teal-300 disabled:border-gray-500 disabled:text-gray-500 disabled:cursor-not-allowed text-teal-200"
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
          className="col-span-2 outline outline-emerald-500 text-emerald-200 disabled:outline-gray-500 disabled:text-gray-500 disabled:cursor-not-allowed border-x-8 border-transparent rounded-lg p-2"
          disabled={isSolving}
        >
          <option>Select an algorithm</option>
          <option>Uniform Cost Search</option>
          <option>A* (Misplaced Tile)</option>
          <option>A* (Manhattan Distance)</option>
        </select>
        <button
          className="outline rounded-lg bg-emerald-500 text-neutral-900 cursor-pointer disabled:bg-emerald-800 disabled:cursor-not-allowe"
          disabled={isSolving}
          onClick={(e) => {
            e.preventDefault();
            solvePuzzle();
          }}
        >
          {isSolving ? <p className="animate-pulse">Solving</p> : "Solve"}
        </button>
      </div>
    </form>
  );
}

export default ControlPanel;
