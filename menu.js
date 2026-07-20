/**
 * ============================================================================
 * 3D BROWSER GAME ENGINE - UI & LEVEL MANAGER
 * ============================================================================
 * [PL] Skrypt zarządzający menu, interfejsem użytkownika (UI) oraz ładowaniem poziomów.
 * [EN] Script managing menus, user interface (UI), and level loading.
 * ============================================================================
 */

// ==========================================
// 1. DOM ELEMENTS / ELEMENTY DOM
// ==========================================

// [PL] Ekrany menu / [EN] Menu screens
const menu1 = document.getElementById("menu1"); // Start Menu
const menu2 = document.getElementById("menu2"); // Instructions
const menu3 = document.getElementById("menu3"); // Rules
const menu4 = document.getElementById("menu4"); // Level Summary

// [PL] Przyciski interfejsu / [EN] Interface buttons
const button1 = document.getElementById("button1"); // Start Game
const button2 = document.getElementById("button2"); // Instructions
const button3 = document.getElementById("button3"); // Back from Instructions
const button4 = document.getElementById("button4"); // Rules
const button5 = document.getElementById("button5"); // Back from Rules
const button6 = document.getElementById("button6"); // Next Level / Summary

// [PL] Elementy HUD i powiadomień / [EN] HUD and messaging elements
const msgBox = document.getElementById("gameMessages");
const hud = document.getElementById("hud");


// ==========================================
// 2. AUDIO SYSTEM / SYSTEM DŹWIĘKOWY
// ==========================================

const clickSound = new Audio("Sound/1.mp3");
const coinCollectSound = new Audio("Sound/2.mp3");
const backgroundMusic = new Audio("Sound/background.mp3"); 

backgroundMusic.loop = true;    // [PL] Odtwarzanie w pętli / [EN] Loop playback
backgroundMusic.volume = 0.1;   // [PL] Głośność muzyki tła / [EN] Background music volume


// ==========================================
// 3. GAME STATE & STATS / STAN I STATYSTYKI GRY
// ==========================================

var level = 0;              // [PL] Aktualny poziom / [EN] Current level
var totalScore = 0;         // [PL] Całkowity wynik / [EN] Total score
var totalCoins = 0;         // [PL] Zebrane monety (globalnie) / [EN] Total collected coins
var totalKeys = 0;          // [PL] Zebrane klucze (globalnie) / [EN] Total collected keys
var totalGameTime = 0;      // [PL] Całkowity czas gry / [EN] Total game time

var TimerGame;              // [PL] Pętla fizyki i renderu / [EN] Physics & render loop
var TimerInterval;          // [PL] Pętla czasu gry / [EN] Game time loop
var msgTimer;               // [PL] Timer wiadomości ekranowych / [EN] Screen message timer
var portalMsgCooldown = false; // [PL] Flaga zapobiegająca spadkom FPS przy staniu w portalu


// ==========================================
// 4. MENU EVENT LISTENERS / OBSŁUGA ZDARZEŃ MENU
// ==========================================

button1.onclick = function() {
    clickSound.play();
    backgroundMusic.play(); 
    
    // [PL] Twardy reset statystyk przy nowej grze / [EN] Hard reset of stats on new game
    level = 0;
    totalScore = 0;
    totalCoins = 0;
    totalKeys = 0;
    totalGameTime = 0;
    enemiesScore = 0; 
    
    loadLevel();
};

button6.onclick = function() {
    clickSound.play();
    
    // [PL] Powrót do menu, jeśli przeszliśmy całą grę / [EN] Return to main menu if game is finished
    if (level === 0 && totalScore > 0) { 
        menu4.style.display = "none";
        menu1.style.display = "block";
    } else {
        loadLevel();
    }
};

// [PL] Nawigacja po podmenu / [EN] Submenu navigation
button2.onclick = function() { clickSound.play(); menu1.style.display = "none"; menu2.style.display = "block"; };
button3.onclick = function() { clickSound.play(); menu1.style.display = "block"; menu2.style.display = "none"; };
button4.onclick = function() { clickSound.play(); menu1.style.display = "none"; menu3.style.display = "block"; };
button5.onclick = function() { clickSound.play(); menu1.style.display = "block"; menu3.style.display = "none"; };


// ==========================================
// 5. CORE LEVEL LOGIC / LOGIKA ŁADOWANIA POZIOMÓW
// ==========================================

/**
 * [PL] Ładuje i inicjalizuje środowisko gry na podstawie aktualnego 'level'.
 * [EN] Loads and initializes the game environment based on the current 'level'.
 */
function loadLevel() {
    // 1. Kopiowanie danych poziomu / 1. Copy level data
    map = makeCopy(mapArray[level]);
    coins = makeCopy(coinsArray[level]);
    keys = makeCopy(keysArray[level]);
    finish = makeCopy(finishArray[level]);
    start = makeCopy(startArray[level]);
    enemies = makeCopy(enemiesArray[level]); 
    mags = makeCopy(magsArray[level]);
    
    // 2. Ustawienie gracza / 2. Set player position
    pawn.x = start[0][0];
    pawn.y = start[0][1];
    pawn.z = start[0][2];
    pawn.rx = start[0][3];
    pawn.ry = start[0][4];
    
    // 3. Reset lokalnych liczników / 3. Reset local level counters
    coinsCount = 0;
    keysCount = 0;
    gameTime = 0;
    enemiesScore = 0;
    
    // 4. Aktualizacja interfejsu UI / 4. UI Update
    document.getElementById("coinCountUI").innerText = "0";
    document.getElementById("keyCountUI").innerText = "0 / " + keys.length;
    document.getElementById("timerUI").innerText = "120.0"; 
    updateScoreUI();
    
    // 5. Przełączanie widoczności elementów / 5. Toggle element visibility
    menu1.style.display = "none";
    menu4.style.display = "none";
    hud.style.display = "block";
    document.getElementById("crosshair").style.display = "block"; 
    
    // 6. Budowanie środowiska 3D / 6. Build 3D environment
    let worldDiv = document.getElementById("world");
    if (worldDiv) worldDiv.innerHTML = ""; // [PL] Czyszczenie starego świata / [EN] Clear old world
    
    CreateNewWorld(map);
    CreateSquares(coins, "coin");
    CreateSquares(mags, "mag");
    CreateSquares(keys, "key");
    CreateSquares(finish, "portal");
    
    if (typeof CreateEnemies === "function") {
        CreateEnemies(enemies);
    }
    
    // 7. Reset amunicji / 7. Reset ammo state
    currentBullets = 6;
    spareMagazines = 2; 
    canShoot = true;
    isReloading = false;
    
    if (typeof updateAmmoUI === "function") updateAmmoUI();
    if (typeof showWeaponState === "function") showWeaponState("Gotowy do strzału");
    
    // 8. Start głównej pętli gry / 8. Start main game loop
    update();
    TimerGame = setInterval(repeatForever, 10);
    
    TimerInterval = setInterval(() => {
        gameTime += 0.1;
        let uiTime = document.getElementById("timerUI");
        
        let timeLeft = (120.0 - gameTime).toFixed(1); 
        uiTime.innerText = Math.max(0, timeLeft).toFixed(1);
        
        // [PL] Efekt kończącego się czasu / [EN] Time running out effect
        if (gameTime >= 110.0) { 
            uiTime.style.color = "#ff3333";
            uiTime.style.fontWeight = "bold";
        } else {
            uiTime.style.color = "#00ff00"; 
            uiTime.style.fontWeight = "normal";
        }

        // [PL] Sprawdzanie limitu czasu / [EN] Time limit check
        if (gameTime >= 120.0) { 
            gameOverTimeUp();
        }
    }, 100);
    
    canlock = true;
} 

/**
 * [PL] Sprawdza warunek zwycięstwa (dotarcie do portalu).
 * [EN] Checks for win condition (reaching the portal).
 */
// [PL] Flaga zapobiegająca spadkom FPS przy staniu w portalu
// [EN] Flag preventing FPS drops when standing inside the portal
var portalMsgCooldown = false;

/**
 * [PL] Sprawdza warunek zwycięstwa (dotarcie do portalu).
 * [EN] Checks for win condition (reaching the portal).
 */
function checkWin() {
    let r = (finish[0][0] - pawn.x)**2 + (finish[0][1] - pawn.y)**2 + (finish[0][2] - pawn.z)**2;
    let r1 = finish[0][6]**2;

    if (r < r1) {
        if (keysCount < keys.length) {
            
            // [PL] Zamiast odpychania - wyświetlamy komunikat co 2 sekundy, jeśli gracz stoi w portalu
            // [EN] Instead of pushback - show message every 2 seconds if player stands in portal
            if (!portalMsgCooldown) {
                showInGameMessage("🔒 FIND ALL KEYS (" + keysCount + "/" + keys.length + ") FIRST!", "#ffcc00");
                portalMsgCooldown = true;
                
                setTimeout(() => { 
                    portalMsgCooldown = false; 
                }, 2000);
            }

        } else {
            // [PL] Koniec poziomu / [EN] Level complete
            clearInterval(TimerGame);
            clearInterval(TimerInterval);
            
            // [PL] Dodawanie do statystyk globalnych / [EN] Update global statistics
            let levelScore = (coinsCount * 100) + enemiesScore;
            totalScore += levelScore;
            totalCoins += coinsCount;
            totalKeys += keysCount;
            totalGameTime += gameTime;
            
            showInGameMessage("🎉 LEVEL CLEAR!", "#00ff00");

            // [PL] Weryfikacja końca gry / [EN] Game end verification
            level++;
            let gameFinished = false;
            if (level === 3) { 
                level = 0;
                gameFinished = true;
            }

            // [PL] Przygotowanie Menu Podsumowania / [EN] Summary Menu preparation
            document.getElementById("summaryTotalCoins").innerText = totalCoins;
            document.getElementById("summaryTotalKeys").innerText = totalKeys;
            document.getElementById("summaryTotalTime").innerText = totalGameTime.toFixed(1);
            
            let scoreDisplay = document.getElementById("summaryTotalScore");
            if (gameFinished) {
                scoreDisplay.innerHTML = totalScore + "<br><br><span style='color:#00ff00; font-size:60px; text-shadow: 3px 3px 0 #000;'>🏆 YOU WIN! 🏆</span>";
            } else {
                scoreDisplay.innerText = totalScore;
            }

            // [PL] Przejście do podsumowania po 2s / [EN] Transition to summary after 2s
            setTimeout(() => {
                hud.style.display = "none";
                document.getElementById("crosshair").style.display = "none"; 
                document.exitPointerLock();
                
                button6.querySelector("p").innerText = gameFinished ? "Main Menu" : "Next Level";
                menu4.style.display = "block";
            }, 2000);
        }
    }
}


// ==========================================
// 6. UTILITIES & UI HELPERS / NARZĘDZIA I INTERFEJS
// ==========================================

/**
 * [PL] Główna pętla powtarzająca się co 10ms.
 * [EN] Main loop executing every 10ms.
 */
function repeatForever() {
    update(); // Z pliku script.js
    checkWin();
}

/**
 * [PL] Aktualizacja punktacji na żywo w interfejsie.
 * [EN] Live score UI update.
 */
function updateScoreUI() {
    let liveScore = totalScore + (coinsCount * 100) + enemiesScore;
    let scoreDisplay = document.getElementById("totalScoreUI");
    if (scoreDisplay) scoreDisplay.innerText = liveScore;
}

/**
 * [PL] Głębokie kopiowanie tablic (zapobiega modyfikacji bazy poziomów).
 * [EN] Deep array copy (prevents modification of the base levels).
 */
function makeCopy(array){
    let NewArray = [];
    if (!array) return NewArray; 
    for (let i = 0; i < array.length; i++){
        if (array[i] && Array.isArray(array[i])) {
            NewArray.push([...array[i]]);
        }
    }
    return NewArray;
}

/**
 * [PL] Wyświetlanie wiadomości in-game na ekranie.
 * [EN] Displaying in-game messages on screen.
 */
function showInGameMessage(text, color = "#ff3333", duration = 3000) {
    clearTimeout(msgTimer);
    
    msgBox.innerHTML = text; 
    msgBox.style.color = color;

    // [PL] Reset animacji CSS / [EN] CSS animation reset
    msgBox.style.animation = 'none';
    msgBox.offsetHeight; 
    msgBox.style.animation = null;

    msgBox.classList.remove("fast-speed", "coin-pickup", "reloading-msg");

    // [PL] Przypisanie specyficznych animacji / [EN] Assigning specific animations
    if (text.toLowerCase().includes("fast speed")) {
        msgBox.classList.add("fast-speed"); 
    } 
    else if (text === "C O I N" || text === "K E Y") {  
        msgBox.classList.add("coin-pickup"); 
    }
    else if (text === "RELOADING...") {
        msgBox.classList.add("reloading-msg"); 
    }

    msgBox.style.display = "block";
    msgTimer = setTimeout(() => { 
        msgBox.style.display = "none"; 
    }, duration);
}

/**
 * [PL] Obsługa zakończenia czasu (Game Over).
 * [EN] Time up handling (Game Over).
 */
function gameOverTimeUp() {
    clearInterval(TimerGame);
    clearInterval(TimerInterval);
    
    canlock = false;
    document.exitPointerLock();

    showInGameMessage("⏰ TIME'S UP!", "#ff0000", 3000);

    // [PL] Restart poziomu po 3s / [EN] Restart level after 3s
    setTimeout(() => {
        loadLevel(); 
    }, 3000);
}