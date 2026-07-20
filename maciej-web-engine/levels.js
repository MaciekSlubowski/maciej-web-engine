/**
 * ============================================================================
 * 3D BROWSER GAME ENGINE - LEVELS DATABASE
 * ============================================================================
 * [PL] Skrypt przechowujący dane poziomów (mapy, obiekty, wrogowie, punkty startowe).
 * [EN] Script containing levels data (maps, objects, enemies, spawn points).
 * ============================================================================
 */

// ==========================================
// 1. DATABASE ARRAYS INITIALIZATION / INICJALIZACJA TABLIC BAZY DANYCH
// ==========================================

var mapArray = [];      // [PL] Architektura poziomów (ściany, podłogi, platformy) / [EN] Level architecture (walls, floors, platforms)
var coinsArray = [];    // [PL] Pozycje monet (punkty/sprint) / [EN] Coin positions (score/sprint)
var finishArray = [];   // [PL] Pozycje portali końcowych / [EN] Finish portal positions
var startArray = [];    // [PL] Punkty startowe gracza / [EN] Player spawn points
var keysArray = [];     // [PL] Pozycje kluczy (wymagane do ukończenia) / [EN] Key positions (required for completion)
var magsArray = [];     // [PL] Pozycje magazynków z amunicją / [EN] Ammo magazine positions
var enemiesArray = [];  // [PL] Pozycje i statystyki przeciwników / [EN] Enemy positions and stats


// ============================================================================
// LEVEL 0: THE CLOSED ROOM / POZIOM 0: ZAMKNIĘTY POKÓJ
// ============================================================================

// --- ARCHITECTURE / ARCHITEKTURA ---
// Format: [x, y, z, rx, ry, rz, width, height, texture_path]
mapArray[0] = [
    // [PL] Główne Ściany Zewnętrzne / [EN] Main Outer Walls
    // Back Wall (Z = 1000)
    [0, 0, 1000, 0, 0, 0, 2000, 200, "Patterns/3.jpg"], 
    [0, 0, 980, 0, 0, 0, 2000, 200, "Patterns/3.jpg"],
    [-1000, 0, 990, 0, 90, 0, 20, 200, "Patterns/3.jpg"], 
    [1000, 0, 990, 0, 90, 0, 20, 200, "Patterns/3.jpg"],

    // Front Wall (Z = -1000)
    [0, 0, -1000, 0, 0, 0, 2000, 200, "Patterns/3.jpg"], 
    [0, 0, -980, 0, 0, 0, 2000, 200, "Patterns/3.jpg"],
    [-1000, 0, -990, 0, 90, 0, 20, 200, "Patterns/3.jpg"], 
    [1000, 0, -990, 0, 90, 0, 20, 200, "Patterns/3.jpg"],

    // Right Wall (X = 1000)
    [1000, 0, 0, 0, 90, 0, 2000, 200, "Patterns/3.jpg"], 
    [980, 0, 0, 0, 90, 0, 2000, 200, "Patterns/3.jpg"],

    // Left Wall (X = -1000)
    [-1000, 0, 0, 0, 90, 0, 2000, 200, "Patterns/3.jpg"], 
    [-980, 0, 0, 0, 90, 0, 2000, 200, "Patterns/3.jpg"],

    // Main Floor
    [0, 100, 0, 90, 0, 0, 2000, 2000, "Patterns/2.jpg"], 

    // [PL] Wewnętrzny Labirynt / [EN] Inner Maze Walls
    // Wall X1
    [500, 0, -500, 0, 0, 0, 1000, 200, "Patterns/3.jpg"],  
    [500, 0, -480, 0, 0, 0, 1000, 200, "Patterns/3.jpg"],  
    [0, 0, -490, 0, 90, 0, 20, 200, "Patterns/3.jpg"],     
    [1000, 0, -490, 0, 90, 0, 20, 200, "Patterns/3.jpg"],  

    // Wall X2
    [-500, 0, 500, 0, 0, 0, 1000, 200, "Patterns/3.jpg"],   
    [-500, 0, 480, 0, 0, 0, 1000, 200, "Patterns/3.jpg"],   
    [-1000, 0, 490, 0, 90, 0, 20, 200, "Patterns/3.jpg"],  
    [0, 0, 490, 0, 90, 0, 20, 200, "Patterns/3.jpg"],      

    // Wall X3
    [0, 0, 0, 0, 0, 0, 500, 200, "Patterns/3.jpg"],        
    [0, 0, 20, 0, 0, 0, 500, 200, "Patterns/3.jpg"],        
    [-250, 0, 10, 0, 90, 0, 20, 200, "Patterns/3.jpg"],    
    [250, 0, 10, 0, 90, 0, 20, 200, "Patterns/3.jpg"],     
    
    // Wall Z1
    [-500, 0, -500, 0, 90, 0, 1000, 200, "Patterns/3.jpg"], 
    [-480, 0, -500, 0, 90, 0, 1000, 200, "Patterns/3.jpg"], 
    [-490, 0, -1000, 0, 0, 0, 20, 200, "Patterns/3.jpg"],  
    [-490, 0, 0, 0, 0, 0, 20, 200, "Patterns/3.jpg"],      
    
    // Wall Z2
    [500, 0, 500, 0, 90, 0, 1000, 200, "Patterns/3.jpg"],   
    [480, 0, 500, 0, 90, 0, 1000, 200, "Patterns/3.jpg"],   
    [490, 0, 0, 0, 0, 0, 20, 200, "Patterns/3.jpg"],       
    [490, 0, 1000, 0, 0, 0, 20, 200, "Patterns/3.jpg"],    
    
    // Wall Z3
    [0, 0, 0, 0, 90, 0, 500, 200, "Patterns/3.jpg"],        
    [-20, 0, 0, 0, 90, 0, 500, 200, "Patterns/3.jpg"],      
    [-10, 0, -250, 0, 0, 0, 20, 200, "Patterns/3.jpg"],    
    [-10, 0, 250, 0, 0, 0, 20, 200, "Patterns/3.jpg"], 
    
    // [PL] Platformy poziomu 0 (Obniżone do ziemi) / [EN] Level 0 Platforms (Lowered to ground)
    // Platform 1 (Top Left)
    [-400, 80, -400, 90, 0, 0, 200, 200, "Patterns/3.jpg"],  // Top
    [-400, 90, -300, 0, 0, 0, 200, 20, "Patterns/3.jpg"],   // Front
    [-400, 90, -500, 0, 0, 0, 200, 20, "Patterns/3.jpg"],   // Back
    [-500, 90, -400, 0, 90, 0, 200, 20, "Patterns/3.jpg"],  // Left
    [-300, 90, -400, 0, 90, 0, 200, 20, "Patterns/3.jpg"],  // Right

    // Platform 2 (Bottom Right)
    [400, 80, 400, 90, 0, 0, 200, 200, "Patterns/3.jpg"],    // Top
    [400, 90, 500, 0, 0, 0, 200, 20, "Patterns/3.jpg"],     // Front
    [400, 90, 300, 0, 0, 0, 200, 20, "Patterns/3.jpg"],     // Back
    [300, 90, 400, 0, 90, 0, 200, 20, "Patterns/3.jpg"],    // Left
    [500, 90, 400, 0, 90, 0, 200, 20, "Patterns/3.jpg"]     // Right
];

// --- COLLECTIBLES & ENTITIES / ZNAJDŹKI I OBIEKTY ---
// Format: [x, y, z, rx, ry, rz, width, height, texture_path, value]

coinsArray[0] = [
    // [PL] Główne Pionowe Korytarze / [EN] Main Vertical Corridors
    [-750, 30, -800, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [-750, 30, -600, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [-750, 30, -400, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [-750, 30, 400,  0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [-750, 30, 600,  0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [-750, 30, 800,  0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    
    [750, 30, -800, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [750, 30, -600, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [750, 30, -400, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [750, 30, -200, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
   
    [750, 30, 600,  0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [750, 30, 800,  0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    
    // [PL] Wewnętrzne Ścieżki Labiryntu / [EN] Inner Maze Paths
    [-250, 30, -800, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [-250, 30, -600, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [-250, 30, -400, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [-250, 30, -200, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [-250, 30, 200,  0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [-250, 30, 400,  0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [-250, 30, 600,  0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [-250, 30, 800,  0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    
    [250, 30, -800, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [250, 30, -600, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [250, 30, 200,  0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [250, 30, 400,  0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [250, 30, 600,  0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [250, 30, 800,  0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    
    // [PL] Centralne Łączniki i Skrzyżowania / [EN] Central Connectors and Intersections
    [-500, 30, 200, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [-500, 30, 600, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [500, 30, -200, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [500, 30, -600, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    
    [0, 30, -350, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [0, 30, -750, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [0, 30, 350, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [0, 30, 750, 0, 0, 0, 50, 50, "Patterns/coin.png", 1]
];

startArray[0] = [
    // [PL] Start w lewym dolnym rogu / [EN] Start in bottom-left corner
    [-900, 0, -900, 0, 0]
];

finishArray[0] = [
    // [PL] Portal na górze pośrodku / [EN] Portal at top-center
    [0, 0, 980, 0, 0, 0, 120, 120, "Patterns/234.png", 50]
];
    
keysArray[0] = [
    // [PL] Klucze wymagane do ucieczki / [EN] Keys required for escape
    [-400, 50, -400, 0, 0, 0, 50, 50, "Patterns/key.png", 50], // Platform 1
    [400, 50, 400, 0, 0, 0, 50, 50, "Patterns/key.png", 50]    // Platform 2
];

magsArray[0] = [
    // [PL] Zapasowa amunicja / [EN] Spare ammo
    [-750, 30, -500, 0, 0, 0, 45, 45, "Patterns/drum.png", 1], // Left corridor
    [0, 30, -550, 0, 0, 0, 45, 45, "Patterns/drum.png", 1],    // Top center passage
];

// Format: [x, y, z, rx, ry, rz, width, height, texture_path, HP]
enemiesArray[0] = [
    // [PL] Obrońcy portalu końcowego / [EN] End portal defenders
    [-300, 0, 700, 0, 0, 0, 160, 160, "Patterns/enemy.png", 3], // Left side guard
    [300, 0, 700, 0, 0, 0, 160, 160, "Patterns/enemy.png", 4],  // Right side guard
    [0, 0, 600, 0, 0, 0, 160, 160, "Patterns/enemy.png", 3],    // Center-front guard
    [0, 0, 400, 0, 0, 0, 160, 160, "Patterns/enemy.png", 4]     // Far-front guard
];


// ============================================================================
// LEVEL 1: THE SANDBOX / POZIOM 1: PIASKOWNICA (KORYTARZE)
// ============================================================================

// --- ARCHITECTURE / ARCHITEKTURA ---
mapArray[1] = [
    // [PL] Zewnętrzny Szkielet - Główna Sala / [EN] Outer Skeleton - Main Room
    [-550, 0, -1000, 0, 0, 0, 900, 200, "Patterns/3.jpg"], 
    [550, 0, -1000, 0, 0, 0, 900, 200, "Patterns/3.jpg"],  
    [0, -80, -1000, 0, 0, 0, 200, 40, "Patterns/3.jpg"],   
    [-550, 0, -980, 0, 0, 0, 900, 200, "Patterns/3.jpg"],  
    [550, 0, -980, 0, 0, 0, 900, 200, "Patterns/3.jpg"],
    [0, -80, -980, 0, 0, 0, 200, 40, "Patterns/3.jpg"],
    [-100, 20, -990, 0, 90, 0, 20, 160, "Patterns/3.jpg"], 
    [100, 20, -990, 0, 90, 0, 20, 160, "Patterns/3.jpg"],  
    [0, -60, -990, 90, 0, 0, 200, 20, "Patterns/3.jpg"],
    [-1000, 0, -990, 0, 90, 0, 20, 200, "Patterns/3.jpg"], 
    [1000, 0, -990, 0, 90, 0, 20, 200, "Patterns/3.jpg"],
    [0, 0, 1000, 0, 0, 0, 2000, 200, "Patterns/3.jpg"], 
    [0, 0, 980, 0, 0, 0, 2000, 200, "Patterns/3.jpg"],  
    [-1000, 0, 990, 0, 90, 0, 20, 200, "Patterns/3.jpg"], 
    [1000, 0, 990, 0, 90, 0, 20, 200, "Patterns/3.jpg"],  
    [1000, 0, 0, 0, 90, 0, 2000, 200, "Patterns/3.jpg"], 
    [980, 0, 0, 0, 90, 0, 2000, 200, "Patterns/3.jpg"],  
    [-1000, 0, 0, 0, 90, 0, 2000, 200, "Patterns/3.jpg"], 
    [-980, 0, 0, 0, 90, 0, 2000, 200, "Patterns/3.jpg"], 
    
    // [PL] Podłogi / [EN] Floors
    [0, 100, 0, 90, 0, 0, 2000, 2000, "Patterns/2.jpg"],      // Main floor
    [0, 100, -1500, 90, 0, 0, 200, 1000, "Patterns/2.jpg"],   // Corridor floor
    [0, 100, -2500, 90, 0, 0, 1000, 1000, "Patterns/2.jpg"],  // Sandbox floor
    
    // [PL] Ściany Korytarza i Sandboxa / [EN] Corridor & Sandbox Walls
    [-100, 0, -1500, 0, 90, 0, 1000, 200, "Patterns/3.jpg"], 
    [100, 0, -1500, 0, 90, 0, 1000, 200, "Patterns/3.jpg"],  
    [0, 0, -3000, 0, 0, 0, 1000, 200, "Patterns/3.jpg"],     
    [-500, 0, -2500, 0, 90, 0, 1000, 200, "Patterns/3.jpg"], 
    [500, 0, -2500, 0, 90, 0, 1000, 200, "Patterns/3.jpg"],  
    [-350, 0, -2000, 0, 0, 0, 600, 200, "Patterns/3.jpg"],   
    [350, 0, -2000, 0, 0, 0, 600, 200, "Patterns/3.jpg"],    
    [0, -80, -2000, 0, 0, 0, 200, 40, "Patterns/3.jpg"],     

    // [PL] Wewnętrzne Grube Ściany (Labirynt) / [EN] Thick Inner Walls (Maze)
    [-300, 0, 0, 0, 90, 0, 1400, 200, "Patterns/3.jpg"], 
    [-280, 0, 0, 0, 90, 0, 1400, 200, "Patterns/3.jpg"], 
    [-290, 0, -700, 0, 0, 0, 20, 200, "Patterns/3.jpg"], 
    [-290, 0, 700, 0, 0, 0, 20, 200, "Patterns/3.jpg"],  
    [300, 0, 0, 0, 90, 0, 1400, 200, "Patterns/3.jpg"],  
    [280, 0, 0, 0, 90, 0, 1400, 200, "Patterns/3.jpg"],  
    [290, 0, -700, 0, 0, 0, 20, 200, "Patterns/3.jpg"],  
    [290, 0, 700, 0, 0, 0, 20, 200, "Patterns/3.jpg"],   
    [0, 0, 700, 0, 0, 0, 600, 200, "Patterns/3.jpg"],    
    [0, 0, 680, 0, 0, 0, 600, 200, "Patterns/3.jpg"],    
    [-300, 0, 690, 0, 90, 0, 20, 200, "Patterns/3.jpg"], 
    [300, 0, 690, 0, 90, 0, 20, 200, "Patterns/3.jpg"],  
    [0, 0, -700, 0, 0, 0, 600, 200, "Patterns/3.jpg"],   
    [0, 0, -680, 0, 0, 0, 600, 200, "Patterns/3.jpg"],   
    [-300, 0, -690, 0, 90, 0, 20, 200, "Patterns/3.jpg"],
    [300, 0, -690, 0, 90, 0, 20, 200, "Patterns/3.jpg"], 

    // [PL] Twierdza H w Sandboxie / [EN] H-Fortress in Sandbox
    [-200, 0, -2500, 0, 90, 0, 600, 200, "Patterns/3.jpg"], 
    [-200, 0, -2500, 0, 90, 0, 600, 200, "Patterns/3.jpg"], 
    [-200, 0, -2800, 0, 0, 0, 20, 200, "Patterns/3.jpg"],   
    [-200, 0, -2200, 0, 0, 0, 20, 200, "Patterns/3.jpg"],   
    [200, 0, -2500, 0, 90, 0, 600, 200, "Patterns/3.jpg"],  
    [200, 0, -2500, 0, 90, 0, 600, 200, "Patterns/3.jpg"],  
    [200, 0, -2800, 0, 0, 0, 20, 200, "Patterns/3.jpg"],    
    [200, 0, -2200, 0, 0, 0, 20, 200, "Patterns/3.jpg"],    
    [0, 0, -2500, 0, 0, 0, 400, 200, "Patterns/3.jpg"],     
    [0, 0, -2480, 0, 0, 0, 400, 200, "Patterns/3.jpg"],     
    [-200, 0, -2490, 0, 90, 0, 20, 200, "Patterns/3.jpg"],  
    [200, 0, -2490, 0, 90, 0, 20, 200, "Patterns/3.jpg"]    
];

// [PL] Platformy Poziomu 1 (Wyniesione na Y=80) / [EN] Level 1 Platforms (Elevated to Y=80)
mapArray[1].push(
    // Platform 1 (Main Room, Top-Left)
    [-400, 80, -400, 90, 0, 0, 200, 200, "Patterns/3.jpg"], 
    [-400, 90, -300, 0, 0, 0, 200, 20, "Patterns/3.jpg"],  
    [-400, 90, -500, 0, 0, 0, 200, 20, "Patterns/3.jpg"],  
    [-500, 90, -400, 0, 90, 0, 200, 20, "Patterns/3.jpg"], 
    [-300, 90, -400, 0, 90, 0, 200, 20, "Patterns/3.jpg"], 

    // Platform 2 (Main Room, Bottom-Right)
    [400, 80, 400, 90, 0, 0, 200, 200, "Patterns/3.jpg"],   
    [400, 90, 500, 0, 0, 0, 200, 20, "Patterns/3.jpg"],    
    [400, 90, 300, 0, 0, 0, 200, 20, "Patterns/3.jpg"],    
    [300, 90, 400, 0, 90, 0, 200, 20, "Patterns/3.jpg"],   
    [500, 90, 400, 0, 90, 0, 200, 20, "Patterns/3.jpg"],   
    
    // Platform 3 (Corridor Entrance)
    [0, 80, -2000, 90, 0, 0, 200, 200, "Patterns/3.jpg"],   
    [0, 90, -1700, 0, 0, 0, 200, 20, "Patterns/3.jpg"],    
    [0, 90, -2000, 0, 0, 0, 200, 20, "Patterns/3.jpg"],    
    [-100, 90, -2000, 0, 90, 0, 200, 20, "Patterns/3.jpg"],   
    [100, 90, -2000, 0, 90, 0, 200, 20, "Patterns/3.jpg"],   
    
    // Platform 4 (Sandbox, Fort Right)
    [350, 80, -2300, 90, 0, 0, 200, 200, "Patterns/3.jpg"],   
    [350, 90, -2200, 0, 0, 0, 200, 20, "Patterns/3.jpg"],    
    [350, 90, -2400, 0, 0, 0, 200, 20, "Patterns/3.jpg"],    
    [250, 90, -2300, 0, 90, 0, 200, 20, "Patterns/3.jpg"],   
    [450, 90, -2300, 0, 90, 0, 200, 20, "Patterns/3.jpg"]
);

// --- COLLECTIBLES & ENTITIES / ZNAJDŹKI I OBIEKTY ---

startArray[1] = [ [-800, 0, 800, 0, 0] ];

finishArray[1] = [ 
    // [PL] Z=-2998 by zapobiec z-fightingu / [EN] Z=-2998 to prevent z-fighting
    [0, 0, -2998, 0, 0, 0, 120, 120, "Patterns/234.png", 50] 
];

keysArray[1] = [
    [650, 30, 850, 0, 0, 0, 50, 50, "Patterns/key.png", 50],
    [-350, 30, -2500, 0, 0, 0, 50, 50, "Patterns/key.png", 50]
];

magsArray[1] = [
    [0, 30, -1500, 0, 0, 0, 45, 45, "Patterns/drum.png", 1], // Middle corridor
    [0, 30, -2000, 0, 0, 0, 45, 45, "Patterns/drum.png", 1], // Sandbox entrance
];

coinsArray[1] = [
    // [PL] Peryferia Głównej Sali (Lewa) / [EN] Main Room Outskirts (Left)
    [-650, 30, 400, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [-650, 30, 0, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [-650, 30, -400, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [-650, 30, -850, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [-325, 30, -850, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    
    // [PL] Peryferia Głównej Sali (Prawa) / [EN] Main Room Outskirts (Right)
    [650, 30, 400, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [650, 30, 0, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [650, 30, -400, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    
    // [PL] Środek Sali / [EN] Center Room
    [0, 30, 400, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [0, 30, 0, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    
    // [PL] Korytarz do Sandboxa / [EN] Corridor to Sandbox
    [0, 30, -1050, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [0, 30, -1350, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [0, 30, -1500, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [0, 30, -1650, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [0, 30, -2000, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],

    // [PL] Okolice Twierdzy H (Sandbox) / [EN] H-Fortress Area (Sandbox)
    [350, 30, -2200, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [-350, 30, -2200, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [350, 30, -2500, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [350, 30, -2750, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [-350, 30, -2750, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [-100, 30, -2650, 0, 0, 0, 50, 50, "Patterns/coin.png", 1] 
];

enemiesArray[1] = [
    // [PL] Main Room Crowd / [EN] Main Room Crowd
    [-200, 0, 500, 0, 0, 0, 160, 160, "Patterns/enemy.png", 3],   
    [400, 0, -100, 0, 0, 0, 160, 160, "Patterns/enemy.png", 3],  
    [0, 0, 100, 0, 0, 0, 160, 160, "Patterns/enemy.png", 4],     

    // [PL] Korytarz (Zasadzka) / [EN] Corridor (Ambush)
    [0, 0, -1100, 0, 0, 0, 160, 160, "Patterns/enemy.png", 3],   

    // [PL] Sandbox (Oblężenie) / [EN] Sandbox (Siege)
    [250, 0, -2600, 0, 0, 0, 160, 160, "Patterns/enemy.png", 5], // Tank on the right
    [0, 0, -2200, 0, 0, 0, 160, 160, "Patterns/enemy.png", 3]    // Defender front
];


// ============================================================================
// LEVEL 2: THE CROSS & SPIRAL / POZIOM 2: KRZYŻ I SPIRALA
// ============================================================================

// --- ARCHITECTURE / ARCHITEKTURA ---
mapArray[2] = [
    // --------------------------------------------------------
    // [PL] Zewnętrzny Szkielet (Skopiowany) / [EN] Outer Skeleton (Copied)
    // --------------------------------------------------------
    [-550, 0, -1000, 0, 0, 0, 900, 200, "Patterns/3.jpg"], 
    [550, 0, -1000, 0, 0, 0, 900, 200, "Patterns/3.jpg"],  
    [0, -80, -1000, 0, 0, 0, 200, 40, "Patterns/3.jpg"],   
    [-550, 0, -980, 0, 0, 0, 900, 200, "Patterns/3.jpg"],  
    [550, 0, -980, 0, 0, 0, 900, 200, "Patterns/3.jpg"],
    [0, -80, -980, 0, 0, 0, 200, 40, "Patterns/3.jpg"],
    [-100, 20, -990, 0, 90, 0, 20, 160, "Patterns/3.jpg"], 
    [100, 20, -990, 0, 90, 0, 20, 160, "Patterns/3.jpg"],  
    [0, -60, -990, 90, 0, 0, 200, 20, "Patterns/3.jpg"],
    [-1000, 0, -990, 0, 90, 0, 20, 200, "Patterns/3.jpg"], 
    [1000, 0, -990, 0, 90, 0, 20, 200, "Patterns/3.jpg"],
    [0, 0, 1000, 0, 0, 0, 2000, 200, "Patterns/3.jpg"], 
    [0, 0, 980, 0, 0, 0, 2000, 200, "Patterns/3.jpg"],  
    [-1000, 0, 990, 0, 90, 0, 20, 200, "Patterns/3.jpg"], 
    [1000, 0, 990, 0, 90, 0, 20, 200, "Patterns/3.jpg"],  
    [1000, 0, 0, 0, 90, 0, 2000, 200, "Patterns/3.jpg"], 
    [980, 0, 0, 0, 90, 0, 2000, 200, "Patterns/3.jpg"],  
    [-1000, 0, 0, 0, 90, 0, 2000, 200, "Patterns/3.jpg"], 
    [-980, 0, 0, 0, 90, 0, 2000, 200, "Patterns/3.jpg"], 
    
    // [PL] Podłogi / [EN] Floors
    [0, 100, 0, 90, 0, 0, 2000, 2000, "Patterns/2.jpg"], 
    [-100, 0, -1500, 0, 90, 0, 1000, 200, "Patterns/2.jpg"], 
    [100, 0, -1500, 0, 90, 0, 1000, 200, "Patterns/2.jpg"],  
    [0, 100, -1500, 90, 0, 0, 200, 1000, "Patterns/2.jpg"],  
    [0, 0, -3000, 0, 0, 0, 1000, 200, "Patterns/2.jpg"],     
    [-500, 0, -2500, 0, 90, 0, 1000, 200, "Patterns/2.jpg"], 
    [500, 0, -2500, 0, 90, 0, 1000, 200, "Patterns/2.jpg"],  
    [0, 100, -2500, 90, 0, 0, 1000, 1000, "Patterns/2.jpg"], 
    [-350, 0, -2000, 0, 0, 0, 600, 200, "Patterns/2.jpg"],   
    [350, 0, -2000, 0, 0, 0, 600, 200, "Patterns/2.jpg"],    
    [0, -80, -2000, 0, 0, 0, 200, 40, "Patterns/2.jpg"],     

    // --------------------------------------------------------
    // [PL] Struktury Wewnętrzne (Grubość 3D) / [EN] Inner Structures (3D Thickness)
    // --------------------------------------------------------
    // 1. SPIRAL IN MAIN ROOM
    // Bottom wall of spiral (Perpendicular to Z)
    [-200, 0, 400, 0, 0, 0, 1600, 200, "Patterns/3.jpg"], 
    [-200, 0, 380, 0, 0, 0, 1600, 200, "Patterns/3.jpg"], 
    [-1000, 0, 390, 0, 90, 0, 20, 200, "Patterns/3.jpg"], 
    [600, 0, 390, 0, 90, 0, 20, 200, "Patterns/3.jpg"],   

    // Right wall of spiral (Perpendicular to X)
    [600, 0, -200, 0, 90, 0, 1200, 200, "Patterns/3.jpg"], 
    [580, 0, -200, 0, 90, 0, 1200, 200, "Patterns/3.jpg"], 
    [590, 0, -800, 0, 0, 0, 20, 200, "Patterns/3.jpg"],   
    [590, 0, 400, 0, 0, 0, 20, 200, "Patterns/3.jpg"],    

    // Top wall of spiral (Perpendicular to Z)
    [0, 0, -800, 0, 0, 0, 1200, 200, "Patterns/3.jpg"],    
    [0, 0, -780, 0, 0, 0, 1200, 200, "Patterns/3.jpg"],    
    [-600, 0, -790, 0, 90, 0, 20, 200, "Patterns/3.jpg"], 
    [600, 0, -790, 0, 90, 0, 20, 200, "Patterns/3.jpg"],  

    // Left closing wall (Perpendicular to X)
    [-600, 0, -400, 0, 90, 0, 800, 200, "Patterns/3.jpg"], 
    [-580, 0, -400, 0, 90, 0, 800, 200, "Patterns/3.jpg"], 
    [-590, 0, -800, 0, 0, 0, 20, 200, "Patterns/3.jpg"],   
    [-590, 0, 0, 0, 0, 0, 20, 200, "Patterns/3.jpg"],      

    // 2. GIANT CROSS IN SANDBOX (-2500)
    // Horizontal cross beam
    [0, 0, -2500, 0, 0, 0, 600, 200, "Patterns/3.jpg"],  
    [0, 0, -2480, 0, 0, 0, 600, 200, "Patterns/3.jpg"],  
    [-300, 0, -2490, 0, 90, 0, 20, 200, "Patterns/3.jpg"], 
    [300, 0, -2490, 0, 90, 0, 20, 200, "Patterns/3.jpg"],  

    // Vertical cross beam
    [0, 0, -2500, 0, 90, 0, 600, 200, "Patterns/3.jpg"],  
    [-20, 0, -2500, 0, 90, 0, 600, 200, "Patterns/3.jpg"],  
    [-10, 0, -2800, 0, 0, 0, 20, 200, "Patterns/3.jpg"],   
    [-10, 0, -2200, 0, 0, 0, 20, 200, "Patterns/3.jpg"]    
];

// [PL] Platformy Poziomu 2 (Wyniesione) / [EN] Level 2 Platforms (Elevated)
mapArray[2].push(
	// Platform 1 (Main Room Spiral, Bottom-Right)
    [750, 80, 750, 90, 0, 0, 200, 200, "Patterns/3.jpg"],
    [750, 90, 850, 0, 0, 0, 200, 20, "Patterns/3.jpg"],
    [750, 90, 650, 0, 0, 0, 200, 20, "Patterns/3.jpg"],
    [650, 90, 750, 0, 90, 0, 200, 20, "Patterns/3.jpg"],
    [850, 90, 750, 0, 90, 0, 200, 20, "Patterns/3.jpg"],

    // Platform 2 (Main Room Spiral, Top-Left)
    [-750, 80, -750, 90, 0, 0, 200, 200, "Patterns/3.jpg"],
    [-750, 90, -650, 0, 0, 0, 200, 20, "Patterns/3.jpg"],
    [-750, 90, -850, 0, 0, 0, 200, 20, "Patterns/3.jpg"],
    [-850, 90, -750, 0, 90, 0, 200, 20, "Patterns/3.jpg"],
    [-650, 90, -750, 0, 90, 0, 200, 20, "Patterns/3.jpg"],

    // Platform 3 (Sandbox, Bottom-Left before cross)
    [-350, 80, -2200, 90, 0, 0, 200, 200, "Patterns/3.jpg"],
    [-350, 90, -2100, 0, 0, 0, 200, 20, "Patterns/3.jpg"],
    [-350, 90, -2300, 0, 0, 0, 200, 20, "Patterns/3.jpg"],
    [-450, 90, -2200, 0, 90, 0, 200, 20, "Patterns/3.jpg"],
    [-250, 90, -2200, 0, 90, 0, 200, 20, "Patterns/3.jpg"],

    // Platform 4 (Sandbox, Bottom-Right before cross)
    [350, 80, -2200, 90, 0, 0, 200, 200, "Patterns/3.jpg"],
    [350, 90, -2100, 0, 0, 0, 200, 20, "Patterns/3.jpg"],
    [350, 90, -2300, 0, 0, 0, 200, 20, "Patterns/3.jpg"],
    [250, 90, -2200, 0, 90, 0, 200, 20, "Patterns/3.jpg"],
    [450, 90, -2200, 0, 90, 0, 200, 20, "Patterns/3.jpg"]
);

// --- COLLECTIBLES & ENTITIES / ZNAJDŹKI I OBIEKTY ---
startArray[2] = [
    // [PL] Przed wejściem w spiralę / [EN] Before entering spiral
    [-800, 0, 800, 0, 0]
];

finishArray[2] = [
    // [PL] Przyklejony w lewym rogu Sandboxa / [EN] Stuck in left corner of Sandbox
    [-350, 0, -2998, 0, 0, 0, 120, 120, "Patterns/234.png", 50]
];

keysArray[2] = [
    // [PL] Klucz 1: W samym centrum spirali / [EN] Key 1: In the exact center of the spiral
    [0, 30, 0, 0, 0, 0, 50, 50, "Patterns/key.png", 50],  
    // [PL] Klucz 2: W prawym górnym rogu Sandboxa / [EN] Key 2: In the top right corner of the Sandbox
    [350, 30, -2800, 0, 0, 0, 50, 50, "Patterns/key.png", 50]   
];

magsArray[2] = [
    [0, 30, 500, 0, 0, 0, 45, 45, "Patterns/drum.png", 1],   // Center spiral room entrance
    [0, 30, -1500, 0, 0, 0, 45, 45, "Patterns/drum.png", 1], // Center long corridor
    [0, 30, -2050, 0, 0, 0, 45, 45, "Patterns/drum.png", 1], // Before cross in Sandbox
];

coinsArray[2] = [
    // [PL] Na platformach (Y=50) / [EN] On platforms (Y=50)
    [750, 50, 750, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [-750, 50, -750, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [-350, 50, -2200, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [350, 50, -2200, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],

    // [PL] Obwód Spirali Zewnętrzny / [EN] Outer Spiral Perimeter
    [-800, 30, 700, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [-400, 30, 700, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [0, 30, 700, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [400, 30, 700, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [800, 30, 700, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    
    [800, 30, 400, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [800, 30, 100, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [800, 30, -200, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [800, 30, -500, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    
    [400, 30, -600, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [0, 30, -600, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [-400, 30, -600, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    
    [-400, 30, -400, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [-400, 30, -100, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [-400, 30, 200, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    
    // [PL] Wewnętrzna Spirala i Klucz / [EN] Inner Spiral and Key Area
    [-200, 30, 200, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [200, 30, 200, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [400, 30, 0, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [-150, 30, 0, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [150, 30, 0, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [0, 30, 150, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [0, 30, -150, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],

    // [PL] Wyjście ze Spirali / [EN] Spiral Exit
    [-800, 30, -400, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [-800, 30, -800, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [-400, 30, -900, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [0, 30, -900, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],

    // [PL] Długi Korytarz / [EN] Long Corridor
    [0, 30, -1100, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [-40, 30, -1200, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [40, 30, -1200, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [0, 30, -2000, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],

    // [PL] Sandbox / [EN] Sandbox
    [0, 30, -2100, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [-400, 30, -2100, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [400, 30, -2100, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [-400, 30, -2500, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
    [400, 30, -2500, 0, 0, 0, 50, 50, "Patterns/coin.png", 1],
];

enemiesArray[2] = [
    // [PL] Zewnętrzne tory Spirali / [EN] Spiral Outer Lanes
    [0, 0, 700, 0, 0, 0, 160, 160, "Patterns/enemy.png", 3],     
    [600, 0, 700, 0, 0, 0, 160, 160, "Patterns/enemy.png", 3],   
    [800, 0, 100, 0, 0, 0, 160, 160, "Patterns/enemy.png", 3],   
    [-200, 0, -600, 0, 0, 0, 160, 160, "Patterns/enemy.png", 4], 

    // [PL] Centrum Spirali / [EN] Spiral Center
    [150, 0, -150, 0, 0, 0, 160, 160, "Patterns/enemy.png", 4], 

    // [PL] Zasadzka w korytarzu / [EN] Corridor Ambush
    [0, 0, -1400, 0, 0, 0, 160, 160, "Patterns/enemy.png", 4],

    // [PL] Sandbox (Obrona) / [EN] Sandbox (Defense)
    [-350, 0, -2150, 0, 0, 0, 160, 160, "Patterns/enemy.png", 3], 
    
    // [PL] Boss przed portalem / [EN] Portal Boss
    [200, 0, -2850, 0, 0, 0, 160, 160, "Patterns/enemy.png", 4],  
];
