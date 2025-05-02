# react-clone
[github.com/acdlite/react-fiber-architecture](https://github.com/acdlite/react-fiber-architecture)

From chatgpt:
React uses **Fiber** as its **reconciliation engine** to improve rendering performance and provide fine-grained control over rendering work. Here's a clear breakdown of **why React uses Fiber**:

---

### 🔧 1. **Interruptible Rendering (Time-Slicing)**
- **Before Fiber**: React’s reconciliation was synchronous and blocking — once it started rendering, it had to finish everything before responding to user interactions.
- **With Fiber**: Rendering work is split into **units of work** that can be paused, aborted, or resumed. This allows React to stay responsive to user input and animations (e.g., during slow renders).

---

### 🧠 2. **Better Scheduling**
- Fiber enables **priority-based rendering**.
- For example, updating a text input (high priority) can happen before offscreen image loading (low priority).
- This makes React apps feel faster and smoother.

---

### 🔁 3. **Incremental Reconciliation**
- Fiber supports **partial updates** to the DOM, allowing React to work on subtrees and commit only what’s ready.
- Helps with rendering large component trees more efficiently.

---

### 🔄 4. **Concurrency & New Features**
- Fiber was essential for features like:
  - **Concurrent Mode** (e.g., `useTransition`)
  - **Suspense** for data fetching and lazy-loading
  - **Selective hydration** in SSR (React 18+)

---

### 📦 5. **More Maintainable Architecture**
- Fiber is a complete rewrite of React’s core algorithm with a **more flexible data structure** (a fiber tree) to manage rendering.

---

### Summary
React uses Fiber to:
- Make rendering **asynchronous and interruptible**
- Improve **responsiveness** and **user experience**
- Enable modern features like **concurrent rendering** and **Suspense**


