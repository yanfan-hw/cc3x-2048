# 🎮 2048 - Cocos Creator 3.x
![Cocos Creator](https://img.shields.io/badge/Cocos_Creator-3.8.8-blue?logo=cocos)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green)

🌍 *[Đọc bằng Tiếng Việt (Read in Vietnamese)](README.vi.md)*

A modern remake of the classic 2048 puzzle game, developed using **Cocos Creator 3.8.8** and **TypeScript**.

More than just a playable game, this project serves as a **clean architectural boilerplate**. It demonstrates how to properly apply the MVC (Model-View-Controller) pattern, Object Pooling, and logic separation in a cross-platform HTML5/Mobile game environment.

## ✨ Project Highlights

* **MVC Architecture:** Pure mathematical calculation logic (`BoardLogic`) is completely decoupled from graphical rendering logic (`GameController`). This makes the codebase easy to maintain, scale, and test.
* **Performance Optimization (Object Pooling):** Zero `instantiate` or `destroy` calls during gameplay. The game uses exactly 16 pre-spawned Tile Nodes that are continuously recycled, ensuring a stable 60 FPS even on low-end devices.
* **Accurate Algorithm:** Applies the *Farthest Position* algorithm from Gabriele Cirulli's original version, preventing "tile jumping" or incorrect merge order bugs.
* **Cross-platform Controls:** Seamlessly supports both Keyboard (Arrow keys/WASD) for PC and Swipe gestures for Mobile devices via environment detection.
* **Auto-save System:** Safely and automatically saves the Best Score to the device's Local Storage.