# 3D Browser Game Engine 🎮

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

A custom-built, pseudo-3D game engine created entirely from scratch using **Vanilla JavaScript, HTML, and CSS 3D Transforms** without the use of WebGL, Canvas, or any external frameworks (like Three.js). 

## 🎓 About the Project

This project was developed by **Maciej Ślubowski** as part of the **"3D Game Creation for Browsers using HTML, CSS and JavaScript - ADVANCED level"** course. 

The course was successfully completed and certified in 2026 during an **Erasmus+** academic exchange program at **RTU Liepaja (Riga Technical University)** in Latvia. Furthermore, the engine serves as a practical exploration of DOM manipulation and custom physics algorithms, complementing Master's degree coursework in Informatics (Cloud Computing specialization) at **Akademia WIT** in Warsaw.

## ✨ Key Features

*   **Zero-Dependency & Supply Chain Immunity**: Built completely without NPM, external packages, or third-party libraries. This architectural choice makes the project inherently secure against software supply chain attacks.
*   **Pure CSS 3D Rendering**: The entire 3D world, including walls, floors, collectibles, and enemies, is rendered using DOM elements and CSS 3D transforms (`translate3d`, `rotateX/Y/Z`).
*   **Custom Physics Engine**: Features an independent physics loop handling gravity, player movement, jumping, and collision detection against 3D objects and walls.
*   **Combat System**: 
    *   Shooting mechanics with projectile hit detection.
    *   Ammo management (limited bullets, reloading mechanics, spare magazines).
    *   Enemy AI that tracks the player, navigates the map, and deals damage with knockback effects.
*   **Dynamic UI & HUD**: A fully functional Heads-Up Display showing health, ammo, collected coins/keys, a countdown timer, and dynamic crosshair states (recoil/reloading).
*   **Level Management**: A modular level system containing multiple stages (e.g., *The Closed Room*, *The Sandbox*, *The Cross & Spiral*).

## 🚀 How to Play

Since the game relies entirely on standard web technologies, there is no need for a complex build process or backend server.

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/MaciekSlubowski/maciej-web-engine.git](https://github.com/MaciekSlubowski/maciej-web-engine.git)

   ## 📄 License & Credits

This project is open-source and provided strictly for **personal, educational, and non-commercial purposes**. You are free to explore, modify, and learn from the codebase.

**Credits & Third-Party Assets:**
*   **Typography:** The UI utilizes the "Super Pixel" font, which is licensed for **PERSONAL USE ONLY**. 
*   **Commercial Restriction:** If you intend to fork or adapt this project for any commercial purposes, you must either replace this font or purchase a valid commercial license directly from the author at [allsuperfont.com](https://allsuperfont.com/product/super-pixel/)[cite: 9].
