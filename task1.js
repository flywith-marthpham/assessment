const case1 = function (n) {
  let count = 0;
  for (let i = 1; i <= n; i++) {
    count += i;
  }
  return count;
};

const case2 = function (n) {
  return Array.from({ length: n }, (_, i) => i + 1).reduce((a, b) => a + b, 0);
};

const case3 = function (n) {
  return ((n + 1) * n) / 2;
};

const case4 = function (n, cache = {}) {
  if (n in cache) return cache[n];
  if (n === 1) return 1;

  cache[n] = n + case4(n - 1, cache);
  return cache[n];
};

console.log(case1(5), case2(5), case3(5), case4(5));
