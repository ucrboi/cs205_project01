import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { isSolvable } from "../utils/randomOrderGenerator";

interface BoardInputProps {
  n: number;
  boardState: number[];
  setBoardState: Dispatch<SetStateAction<number[]>>;
  setInitialState: Dispatch<SetStateAction<number[]>>;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
}

function BoardInput({
  n,
  boardState,
  setBoardState,
  setInitialState,
  setIsEditing,
}: BoardInputProps) {
  const [boardSize, setBoardSize] = useState<number>(n);
  const [inputs, setInputs] = useState<string[]>(Array(n * n).fill(""));
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setBoardSize(n);
    setInputs(boardState.map((s) => `${s}`));
    setError("");
  }, [n, boardState]);

  const handleChange = (index: number, value: string) => {
    if (!/^-?\d*$/.test(value)) return; // only allow negative sign and digits
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };

  const handleSubmit = () => {
    const parsed = inputs.map((v) => parseInt(v, 10));

    if (parsed.some((v) => isNaN(v))) {
      setError("All cells must be filled.");
      return;
    }

    const validRange = new Set(Array.from({ length: n * n }, (_, i) => i + 1));
    validRange.add(-1);

    const duplicates = new Set<number>();
    for (const val of parsed) {
      if (!validRange.has(val)) {
        setError(`Values must be between 1 and ${n * n} or -1.`);
        return;
      }
      if (duplicates.has(val)) {
        setError("Values must be unique.");
        return;
      }
      duplicates.add(val);
    }

    if (!isSolvable(parsed)) {
      setError("This order is not solvable");
      return;
    }

    setError("");
    setBoardState(parsed);
    setInitialState(parsed);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div
        className={`grid ${
          boardSize === 3 ? "grid-cols-3" : "grid-cols-4"
        } gap-1 w-[50vw] aspect-square mx-auto`}
      >
        {inputs.map((value, i) => (
          <input
            key={i}
            value={value}
            onChange={(e) => handleChange(i, e.target.value)}
            className="border rounded-sm h-full w-full text-center text-2xl bg-white text-black"
            maxLength={3}
          />
        ))}
      </div>

      {error && <div className="text-red-500">{error}</div>}

      <button
        onClick={handleSubmit}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Submit
      </button>
    </div>
  );
}

export default BoardInput;
