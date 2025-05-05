interface Node {
  state: number[];
  parent: Node | null;
  g: number;
  cost: number;
  depth: number;
}

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

export function UniformCostSearch(initialState: number[]) {
  const goal = getGoalState(initialState.length);
  const queue = new MinPQ();
  const explored = new Map<string, number>();
  let expanded = 0;

  const initialNode = {
    state: initialState,
    parent: null,
    g: 0,
    cost: 0,
    depth: 0,
  } as Node;

  explored.set(initialState.join(","), 0);
  queue.insert(initialNode);

  while (!queue.isEmpty()) {
    const node = queue.extractMin()!;
    const key = node.state.join(",");

    if (node.cost > (explored.get(key) ?? Infinity)) {
      continue;
    }

    expanded++;

    if (isGoal(node.state, goal)) {
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

    const blankIndex = node.state.indexOf(-1);
    const row = Math.floor(blankIndex / 3),
      col = blankIndex % 3;

    for (const { dr, dc } of [
      { dr: -1, dc: 0 },
      { dr: +1, dc: 0 },
      { dr: 0, dc: -1 },
      { dr: 0, dc: +1 },
    ]) {
      const nr = row + dr,
        nc = col + dc;
      if (nr < 0 || nr > 2 || nc < 0 || nc > 2) continue;

      const swapIdx = nr * 3 + nc;
      const nextState = node.state.slice();
      [nextState[blankIndex], nextState[swapIdx]] = [
        nextState[swapIdx],
        nextState[blankIndex],
      ];

      const g = node.g + 1;
      const cKey = nextState.join(",");
      const prevG = explored.get(cKey);
      if (prevG === undefined || g + 1 < prevG) {
        explored.set(cKey, g);
        const child: Node = {
          state: nextState,
          parent: node,
          g,
          cost: node.cost + 1,
          depth: node.depth + 1,
        };
        queue.insert(child);
      }
    }
  }
}

function misplacedTiles(state: number[], goal: number[]): number {
  let h = 0;
  for (let i = 0; i < state.length; i++) {
    if (state[i] !== -1 && state[i] !== goal[i]) h++;
  }
  return h;
}

export function AStarMisplacedTile(initialState: number[]) {
  const goal = getGoalState(initialState.length);
  const queue = new MinPQ();
  const explored = new Map<string, number>();
  let expanded = 0;

  const initH = misplacedTiles(initialState, goal);
  const initialNode = {
    state: initialState,
    parent: null,
    g: 0,
    cost: initH,
    depth: 0,
  } as Node;

  explored.set(initialState.join(","), 0);
  queue.insert(initialNode);

  while (!queue.isEmpty()) {
    const node = queue.extractMin()!;
    const key = node.state.join(",");

    if (node.g > (explored.get(key) ?? Infinity)) {
      continue;
    }

    expanded++;

    if (isGoal(node.state, goal)) {
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

    const blankIndex = node.state.indexOf(-1);
    const row = Math.floor(blankIndex / 3),
      col = blankIndex % 3;
    for (const { dr, dc } of [
      { dr: -1, dc: 0 },
      { dr: +1, dc: 0 },
      { dr: 0, dc: -1 },
      { dr: 0, dc: +1 },
    ]) {
      const nr = row + dr,
        nc = col + dc;
      if (nr < 0 || nr > 2 || nc < 0 || nc > 2) continue;

      const swapIdx = nr * 3 + nc;
      const nextState = node.state.slice();
      [nextState[blankIndex], nextState[swapIdx]] = [
        nextState[swapIdx],
        nextState[blankIndex],
      ];

      const g = node.g + 1;
      const h = misplacedTiles(nextState, goal);
      const f = g + h;

      const cKey = nextState.join(",");
      const prevG = explored.get(cKey);
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
}

function manhattanDistance(state: number[], goalPos: number[]): number {
  let h = 0;
  for (let i = 0; i < state.length; i++) {
    const tile = state[i];
    if (tile === -1) continue;
    const goalIdx = goalPos.indexOf(tile)!;
    const r1 = Math.floor(i / 3),
      c1 = i % 3;
    const r2 = Math.floor(goalIdx / 3),
      c2 = goalIdx % 3;
    h += Math.abs(r1 - r2) + Math.abs(c1 - c2);
  }
  return h;
}

export function AStarManhattan(initialState: number[]) {
  const goal = getGoalState(initialState.length);
  const queue = new MinPQ();
  const explored = new Map<string, number>();
  let expanded = 0;

  const initH = manhattanDistance(initialState, goal);
  const initialNode = {
    state: initialState,
    parent: null,
    g: 0,
    cost: initH,
    depth: 0,
  } as Node;

  explored.set(initialState.join(","), 0);
  queue.insert(initialNode);

  while (!queue.isEmpty()) {
    const node = queue.extractMin()!;
    const key = node.state.join(",");

    if (node.g > (explored.get(key) ?? Infinity)) {
      continue;
    }

    expanded++;

    if (isGoal(node.state, goal)) {
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

    const blankIdx = node.state.indexOf(-1);
    const row = Math.floor(blankIdx / 3),
      col = blankIdx % 3;
    for (const { dr, dc } of [
      { dr: -1, dc: 0 },
      { dr: +1, dc: 0 },
      { dr: 0, dc: -1 },
      { dr: 0, dc: +1 },
    ]) {
      const nr = row + dr,
        nc = col + dc;
      if (nr < 0 || nr > 2 || nc < 0 || nc > 2) continue;

      const swapIdx = nr * 3 + nc;
      const nextState = node.state.slice();
      [nextState[blankIdx], nextState[swapIdx]] = [
        nextState[swapIdx],
        nextState[blankIdx],
      ];

      const g = node.g + 1;
      const h = manhattanDistance(nextState, goal);
      const f = g + h;

      const cKey = nextState.join(",");
      const prevG = explored.get(cKey);
      if (prevG === undefined || g < prevG) {
        explored.set(cKey, g);
        const child: Node = {
          state: nextState,
          parent: node,
          g: g,
          cost: f,
          depth: node.depth + 1,
        };
        queue.insert(child);
      }
    }
  }
}
