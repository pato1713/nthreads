# 🧵 nthreads

A minimalistic library for working with worker threads in Node.js. It allows developers to spawn worker threads directly from JavaScript functions, abstracting away the need for manually managing worker files. The library automatically creates temporary worker files behind the scenes and handles the lifecycle of threads, making it simple to offload heavy computations to separate threads.

## ✨ Key Features

- 🔄 **Function-based threading:** Run your task directly in a separate thread by passing a function
- 📁 **No file management:** Automatically handles temporary worker files, eliminating the need for manual file creation and management
- ⚡ **Promise-based API:** Easily interact with threads and get results or handle errors as promises
- 🐍 **Clean, Python-inspired API:** Designed to provide a familiar and easy-to-use API, similar to Python's threading module

## 🎯 Perfect Use Case

Ideal for developers looking to parallelize CPU-intensive tasks in Node.js without the overhead of boilerplate worker code.
