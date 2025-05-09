import * as motion from "motion/react-client";

interface BoardProps {
  n: number;
  boardState: number[];
}

const spring = {
  type: "spring",
  damping: 20,
  stiffness: 300,
};

function Board({ n, boardState }: BoardProps) {
  return (
    <div
      className={`grid gap-1 w-[50vw] md:w-[30vw]  aspect-square mx-auto mb-14`}
      style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
    >
      {boardState.map((t) => {
        if (t === -1) {
          return (
            <motion.li
              key={t}
              layout
              transition={spring}
              className="rounded-sm h-full w-full flex items-center justify-center"
            ></motion.li>
          );
        }

        return (
          <motion.li
            key={t}
            layout
            transition={spring}
            className="border rounded-sm h-full w-full flex items-center justify-center bg-slate-700 text-2xl text-bold"
          >
            {t}
          </motion.li>
        );
      })}
    </div>
  );
}

export default Board;
