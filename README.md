# 3D Browser Game Engine 🎮

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

A custom-built, pseudo-3D game engine created entirely from scratch using **Vanilla JavaScript, HTML, and CSS 3D Transforms** — without the use of WebGL, Canvas, or any external frameworks (like Three.js). 

## 🎓 About the Project

This project was developed by **Maciej Ślubowski** as part of the Master's degree coursework in Informatics (Cloud Computing specialization) at **Akademia WIT** in Warsaw. 

Furthermore, the game engine was expanded and refined during an **Erasmus+ academic exchange program in Liepāja, Latvia**. It serves as a practical exploration of DOM manipulation, advanced CSS mathematics (`transform-style: preserve-3d`), and custom physics algorithms running entirely in the browser.

## ✨ Key Features

*   **Pure CSS 3D Rendering**: The entire 3D world, including walls, floors, collectibles, and enemies, is rendered using DOM elements and CSS 3D transforms (`translate3d`, `rotateX/Y/Z`).
*   **Custom Physics Engine**: Features an independent physics loop handling gravity, player movement, jumping, and collision detection against 3D objects and walls.
*   **Combat System**: 
    *   Shooting mechanics with projectile hit detection.
    *   Ammo management (limited bullets, reloading mechanics, spare magazines).
    *   Enemy AI that tracks the player, navigates the map, and deals damage with knockback effects.
*   **Dynamic UI & HUD**: A fully functional Heads-Up Display showing health, ammo, collected coins/keys, a countdown timer, and dynamic crosshair states (recoil/reloading).
*   **Level Management**: A modular level system containing multiple stages (e.g., *The Closed Room*, *The Sandbox*, *The Cross & Spiral*).
*   **Resource Management**: 
    *   Collect **Coins** to enable the Sprint ability.
    *   Collect **Keys** to unlock the final portal and escape the level.

## 🚀 How to Play

Since the game relies entirely on standard web technologies, there is no need for a complex build process or backend server.

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/MaciekSlubowski/maciej-web-engine.git](https://github.com/MaciekSlubowski/maciej-web-engine.git)
