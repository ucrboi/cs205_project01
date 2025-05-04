import { Dispatch, SetStateAction } from "react";
import randomOrderGenerator from "../utils/randomOrderGenerator";

interface ControlPanelProps {
  n: number;
  setBoardState: Dispatch<SetStateAction<number[]>>;
  isEditing: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
}

function ControlPanel({
  n,
  setBoardState,
  isEditing,
  setIsEditing,
}: ControlPanelProps) {
  return (
    <form className="flex flex-col gap-2">
      <div className="flex gap-4 w-full justify-center">
        <button
          className="p-2 rounded-lg w-50 cursor-pointer border text-amber-300 border-amber-300 disabled:border-amber-200 disabled:cursor-not-allowed"
          onClick={(e) => {
            e.preventDefault();
            const arr = randomOrderGenerator(n);
            setBoardState([...arr]);
          }}
          disabled={false}
        >
          Random Combination
        </button>
        {!isEditing && (
          <button
            className="p-2 rounded-lg w-50 cursor-pointer border border-teal-300 disabled:border-teal-200 disabled:cursor-not-allowed text-teal-200"
            onClick={(e) => {
              e.preventDefault();
              setIsEditing(!isEditing);
            }}
            disabled={false}
          >
            Custom Input
          </button>
        )}
      </div>
    </form>
  );
}

export default ControlPanel;
