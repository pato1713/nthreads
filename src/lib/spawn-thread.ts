import fs from "fs";
import os from "os";
import path from "path";
import { Worker } from "worker_threads";
import { randomUUID } from "crypto";

export class Thread<T = any> {
  private worker: Worker;
  private tmpFile: string;

  constructor(private fn: Function) {
    if (typeof fn !== "function") {
      throw new Error("Thread requires a function");
    }
    this.tmpFile = path.join(os.tmpdir(), `thread-${randomUUID()}.mjs`);
    this.worker = this.createWorker();
  }

  private createWorker(): Worker {
    const fnString = this.fn.toString();
    const fnName = this.fn.name || "recursiveFunction";

    const workerCode = `
      import { parentPort } from 'worker_threads';
      const ${fnName} = ${fnString};
      if (!${fnName}.name) {
        Object.defineProperty(${fnName}, 'name', { value: '${fnName}' });
      }
      
      parentPort.on('message', async (args) => {
        try {
          const result = await ${fnName}(...args);
          parentPort.postMessage({ result });
        } catch (err) {
          parentPort.postMessage({ error: err.stack || err.message });
        }
      });
    `;

    fs.writeFileSync(this.tmpFile, workerCode);
    return new Worker(this.tmpFile);
  }

  async execute(...args: any[]): Promise<T> {
    return new Promise((resolve, reject) => {
      this.worker.once("message", (msg) => {
        if (msg.error) reject(new Error(msg.error));
        else resolve(msg.result);
      });
      this.worker.postMessage(args);
    });
  }

  async terminate(): Promise<void> {
    await this.worker.terminate();
    fs.unlinkSync(this.tmpFile);
  }
}

export function spawn<T>(fn: Function) {
  const thread = new Thread<T>(fn);
  const callable = (...args: any[]) => thread.execute(...args);
  callable.terminate = () => thread.terminate();
  return callable;
}
