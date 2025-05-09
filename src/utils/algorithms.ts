// Since all the algorithms are basically A* search with different heuristics
// I have defined a `generalSearch` function which accepts a heuristic function.
// The function would calculate a heuristic value (h) after given a particular
// state and a goal state.

// There is no heuristic in uniform cost search, so the function simply returns 0
export function UniformCostSearch(initilState: number[]) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return generalSearch(initilState, (_state, _goal) => 0);
}

// The Misplaced tile heuristic counts the number of tiles that are not in place
export function AStarMisplacedTile(initialState: number[]) {
  return generalSearch(initialState, (state, goal) => {
    let h = 0;
    for (let i = 0; i < state.length; i++) {
      if (state[i] !== -1 && state[i] !== goal[i]) h++;
    }
    return h;
  });
}

// The Manhattan Distance heuristic, just like the name, counts the distance (in tile units)
// from a particular tile to its goal tile for each tile.
export function AStarManhattan(initialState: number[]) {
  const n = Math.sqrt(initialState.length);
  return generalSearch(initialState, (state, goal) => {
    let h = 0;
    for (let i = 0; i < state.length; i++) {
      const tile = state[i];
      if (tile === -1) continue;
      const goalIdx = goal.indexOf(tile)!;
      const row1 = Math.floor(i / n);
      const col1 = i % n;
      const row2 = Math.floor(goalIdx / n);
      const col2 = goalIdx % n;
      h += Math.abs(row1 - row2) + Math.abs(col1 - col2);
    }
    return h;
  });
}

/**
 *
 * @param initialState The starting state of the puzzle
 * @param heuristic The hueristic function which calculates the `h` value which is used while calculating the cost
 * @returns expandedNodes: The number of nodes expanded while finding the solution,
 * depth: The depth of the solution,
 * solutionPath: The intermediate states from the initialState to the goalState
 */
export function generalSearch(
  initialState: number[],
  heuristic: (state: number[], goal: number[]) => number
) {
  // Start timing
  const t0 =
    typeof performance !== "undefined" && typeof performance.now === "function"
      ? performance.now()
      : Date.now();

  const goal = getGoalState(initialState.length);
  const n = Math.sqrt(initialState.length);

  // I use a minimum priority queue to insert nodes and retrieve the nodes with
  // the minimum cost in logarithmic time
  const queue = new MinPQ(); // MAKE-QUEUE()

  // Keeps track of visited nodes as well as their latest cost
  // The string type state is just all the values of the state array concatenated with a `,`
  const explored = new Map<string, number>();
  let expanded = 0;

  const initH = heuristic(initialState, goal);
  const initialNode: Node = {
    state: initialState,
    parent: null,
    g: 0,
    cost: initH,
    depth: 0,
  }; // MAKE-NODE(problem.INITIAL-STATE)

  explored.set(initialState.join(","), 0);
  queue.insert(initialNode);

  // loop
  while (!queue.isEmpty()) {
    const node = queue.extractMin()!;
    const key = node.state.join(",");

    // In case we have already explored the state with a lower cost,
    // We do not expand more
    //
    // The ?? notation means that if the particular state is not present
    // in the map, the undefined value will be replaced by Infinity
    if (node.g > (explored.get(key) ?? Infinity)) {
      continue;
    }

    expanded++;

    // If we have found the goal state
    if (isGoal(node.state, goal)) {
      // End timing
      const t1 =
        typeof performance !== "undefined" &&
        typeof performance.now === "function"
          ? performance.now()
          : Date.now();
      const elapsedMs = t1 - t0;
      console.log(`Search finished in ${elapsedMs.toFixed(2)} ms`);

      // Trace path from the goal state back up to the initial state
      const path: number[][] = [];
      let cur: Node | null = node;
      while (cur) {
        path.unshift(cur.state);
        cur = cur.parent;
      }

      return {
        expandedNodes: expanded,
        solutionDepth: node.depth,
        solutionPath: path,
      };
    }

    // Expand nodes
    // The legal operators here are
    // 1 - Move blank tile up
    // 2 - Move blank tile down
    // 3 - Move blank tile left
    // 4 - Move blank tile right
    const blankIndex = node.state.indexOf(-1);
    const row = Math.floor(blankIndex / n),
      col = blankIndex % n;
    for (const { dr, dc } of [
      { dr: -1, dc: 0 },
      { dr: +1, dc: 0 },
      { dr: 0, dc: -1 },
      { dr: 0, dc: +1 },
    ]) {
      const nr = row + dr,
        nc = col + dc;
      if (nr < 0 || nr > n - 1 || nc < 0 || nc > n - 1) continue;

      const swapIdx = nr * n + nc;
      const nextState = node.state.slice();
      [nextState[blankIndex], nextState[swapIdx]] = [
        nextState[swapIdx],
        nextState[blankIndex],
      ];

      // Calculate cost for the new state
      const g = node.g + 1;
      const h = heuristic(nextState, goal);
      const f = g + h;

      const cKey = nextState.join(",");
      const prevG = explored.get(cKey);

      // Expand the node iff the new cost for that state is
      // lower than a previously calculated cost, or if it
      // doesn't exist
      if (prevG === undefined || g < prevG) {
        explored.set(cKey, g);
        const child: Node = {
          state: nextState,
          parent: node,
          g,
          cost: f,
          depth: node.depth + 1,
        };
        queue.insert(child);
      }
    }
  }

  // return Failure
  // The code is guarenteed to never reach here because all the inputs
  // provided are completely solvable and the algorithm would always find a solution
}

function getGoalState(length: number) {
  const temp = [];
  for (let i = 0; i < length - 1; i++) {
    temp.push(i + 1);
  }
  temp.push(-1);
  return temp;
}

function isGoal(state: number[], goal: number[]): boolean {
  return state.join(",") === goal.join(",");
}

interface Node {
  state: number[];
  parent: Node | null;
  g: number;
  cost: number;
  depth: number;
}

// Simple binary‐heap min‑priority‑queue on Node.cost
class MinPQ {
  private heap: Node[] = [];

  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  insert(node: Node) {
    this.heap.push(node);
    this.bubbleUp(this.heap.length - 1);
  }

  extractMin(): Node | undefined {
    if (this.isEmpty()) return undefined;
    const min = this.heap[0];
    const last = this.heap.pop()!;
    if (!this.isEmpty()) {
      this.heap[0] = last;
      this.bubbleDown(0);
    }
    return min;
  }

  private bubbleUp(i: number) {
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (this.heap[i].cost >= this.heap[p].cost) break;
      [this.heap[i], this.heap[p]] = [this.heap[p], this.heap[i]];
      i = p;
    }
  }

  private bubbleDown(i: number) {
    const n = this.heap.length;
    while (true) {
      let smallest = i;
      const l = 2 * i + 1,
        r = 2 * i + 2;
      if (l < n && this.heap[l].cost < this.heap[smallest].cost) smallest = l;
      if (r < n && this.heap[r].cost < this.heap[smallest].cost) smallest = r;
      if (smallest === i) break;
      [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
      i = smallest;
    }
  }
}
