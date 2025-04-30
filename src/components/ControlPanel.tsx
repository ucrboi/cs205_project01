import { Dispatch, SetStateAction } from "react";
import randomOrderGenerator from "../utils/randomOrderGenerator";

interface ControlPanelProps {
  n: number;
  setBoardState: Dispatch<SetStateAction<number[]>>;
}

function ControlPanel({ n, setBoardState }: ControlPanelProps) {
  return (
    <form>
      <button
        className="p-2 rounded-lg cursor-pointer bg-amber-300 disabled:bg-amber-200 disabled:cursor-not-allowed text-black"
        onClick={(e) => {
          e.preventDefault();
          const arr = randomOrderGenerator(n);
          setBoardState([...arr]);
        }}
        disabled={false}
      >
        Random Combination
      </button>
    </form>
  );
}

export default ControlPanel;
