const levelTable: { [K: number]: number } = {
  1: 0,
  2: 100,
  3: 250,
  4: 500,
  5: 950,
  6: 1600,
  7: 2500,
  8: 3600,
  9: 5100,
  10: 7200,
};

const expToLevel = (exp: number): number => {
  let level = 1;
  for (let l = 1; l < 11; l += 1) {
    if (exp >= levelTable[l]) {
      level = l;
    } else {
      break;
    }
  }
  return level;
};

const nextLevelExp = (exp: number): number => {
  const nextLevel = expToLevel(exp) + 1;
  if (nextLevel === 11) {
    return 999999;
  }
  return levelTable[nextLevel];
};

export { expToLevel, nextLevelExp };
