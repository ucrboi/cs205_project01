// https://www.cs.princeton.edu/courses/archive/spring21/cos226/assignments/8puzzle/specification.php
function isSolvable(arr: number[]): boolean {
  const blankIndex = arr.findIndex((el) => el === -1);
  const boardSize = Math.sqrt(arr.length);
  const res = arr.filter((el) => el !== -1);

  let inversions = 0;
  for (let i = 0; i < res.length; i++) {
    for (let j = i + 1; j < res.length; j++) {
      if (res[i] > res[j]) {
        inversions++;
      }
    }
  }

  if (boardSize % 2 !== 0) {
    // Odd board size
    return inversions % 2 === 0;
  } else {
    //Even board size
    return (inversions + Math.floor(blankIndex / boardSize)) % 2 === 0;
  }
}

function randomOrderGenerator(length: number) {
  const arr = Array.from({ length: length * length - 1 }, (_, i) => i + 1);
  arr.push(-1);
  let solvable = false;

  while (!solvable) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    solvable = isSolvable(arr);
  }

  return arr;
}

export default randomOrderGenerator;
