import { spawn } from "./lib/spawn-thread";

const calculateFibonacci = (n: number): number => {
  if (n <= 1) return n;
  return calculateFibonacci(n - 1) + calculateFibonacci(n - 2);
};

async function runRegularAsync() {
  console.time("regular async execution");
  const results = await Promise.all([
    Promise.resolve(calculateFibonacci(40)),
    Promise.resolve(calculateFibonacci(41)),
    Promise.resolve(calculateFibonacci(42)),
  ]);
  console.timeEnd("regular async execution");

  results.forEach((result, index) => {
    console.log(`Regular async ${index + 1} result: ${result}`);
  });
}

async function main() {
  // First run regular async
  await runRegularAsync();

  console.log("\n-------------------\n");

  let thread1, thread2, thread3;

  try {
    // Create three threads with the same function
    thread1 = spawn<number>(calculateFibonacci);
    thread2 = spawn<number>(calculateFibonacci);
    thread3 = spawn<number>(calculateFibonacci);

    console.time("parallel execution");

    // Run calculations in parallel
    const results = await Promise.all([thread1(40), thread2(41), thread3(42)]);

    console.timeEnd("parallel execution");

    // Print results
    results.forEach((result, index) => {
      console.log(`Thread ${index + 1} result: ${result}`);
    });
  } finally {
    // Ensure threads are always cleaned up
    if (thread1) await thread1.terminate();
    if (thread2) await thread2.terminate();
    if (thread3) await thread3.terminate();
  }
}

// Use proper async error handling
main().catch((error) => {
  console.error("Error in main:", error);
  process.exit(1);
});
