interface Node {
  state: number[];
  parent: Node | null;
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

export function UniformCostSearch(intialState: number[]) {
  const goal = getGoalState(intialState.length);
  const queue = new MinPQ();
  const explored = new Map<string, number>();
  let expanded = 0;

  const initialNode = {
    state: intialState,
    parent: null,
    cost: 0,
    depth: 0,
  } as Node;

  explored.set(intialState.join(","), 0);
  queue.insert(initialNode);

  while (!queue.isEmpty()) {
    const node = queue.extractMin();
    if (!node) {
      break;
    }

    if (node.cost > (explored.get(node.state.join(",")) ?? Infinity)) {
      continue;
    }

    expanded += 1;
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
    const moves = [
      { dr: -1, dc: 0 },
      { dr: +1, dc: 0 },
      { dr: 0, dc: -1 },
      { dr: 0, dc: +1 },
    ];

    for (const { dr, dc } of moves) {
      const nr = row + dr,
        nc = col + dc;
      if (nr >= 0 && nr < 3 && nc >= 0 && nc < 3) {
        const swapIdx = nr * 3 + nc;
        const nextState = node.state.slice();
        [nextState[blankIndex], nextState[swapIdx]] = [
          nextState[swapIdx],
          nextState[blankIndex],
        ];

        const child = {
          state: nextState,
          parent: node,
          cost: node.cost + 1,
          depth: node.depth + 1,
        } as Node;

        const cKey = child.state.join(",");
        const prevCost = explored.get(cKey);
        if (prevCost === undefined || child.cost < prevCost) {
          explored.set(cKey, child.cost);
          queue.insert(child);
        }
      }
    }
  }
}
