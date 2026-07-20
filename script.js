/**
 * ============================================================================
 * 3D BROWSER GAME ENGINE CORE
 * ============================================================================
 * [PL] Główny skrypt silnika gry 3D. Odpowiada za fizykę, poruszanie się, 
 *      obsługę broni, kolizje oraz renderowanie świata poprzez CSS 3D.
 * [EN] Main 3D game engine script. Handles physics, movement, weapons, 
 *      collisions, and world rendering via CSS 3D.
 * ============================================================================
 */

// ==========================================
// 1. GLOBAL VARIABLES & CONSTANTS / ZMIENNE GLOBALNE I STAŁE
// ==========================================

// [PL] Przelicznik stopni na radiany. / [EN] Degrees to radians multiplier.
const dag = Math.PI / 180; 

// [PL] Referencje do elementów DOM / [EN] DOM Element References
const world = document.getElementById("world");

// --- INPUT & MOVEMENT STATE / STAN WEJŚCIA I RUCHU ---
var PressUp = 0;
var PressLeft = 0;
var PressRight = 0;
var PressForward = 0;
var PressBack = 0;
var PressSprint = 1;
var MouseX = 0;
var MouseY = 0;
var enemiesScore = 0; // [PL] Punkty za wrogów / [EN] Score from enemies
var lock = false;     // [PL] Czy kursor jest zablokowany? / [EN] Is pointer locked?
var canlock = false;  // [PL] Czy można zablokować kursor? / [EN] Can pointer be locked?

// --- PHYSICS & GRAVITY / FIZYKA I GRAWITACJA ---
var vy = 0;                // [PL] Prędkość pionowa / [EN] Vertical velocity (Y-axis)
var gravity = 0.3;         // [PL] Siła grawitacji / [EN] Gravity force
var playerKnockbackX = 0;  // [PL] Odrzut gracza w osi X / [EN] Player knockback X
var playerKnockbackZ = 0;  // [PL] Odrzut gracza w osi Z / [EN] Player knockback Z

// --- INVENTORY & ITEMS / EKWIPUNEK I PRZEDMIOTY ---
var coinsCount = 0;
var keysCount = 0;
var sprintTimer = null;
var sprintTimeLeft = 1000; // [PL] Czas sprintu (ms) / [EN] Sprint time left in ms

// --- COMBAT & HEALTH / WALKA I ZDROWIE ---
var playerMaxHealth = 10;
var playerHealth = 10;
var isInvulnerable = false; // [PL] Klatki nieśmiertelności / [EN] Invincibility frames (i-frames)

var maxBullets = 6;
var currentBullets = 6;
var spareMagazines = 2;     // [PL] Zapasowe bębny / [EN] Spare magazines
var canShoot = true;
var isReloading = false;

var bullets = [];           // [PL] Tablica aktywnych pocisków / [EN] Active bullets array
var bulletSpeed = 15;       // [PL] Prędkość lotu pocisku / [EN] Bullet flight speed
var bulletRadius = 5;       // [PL] Promień kolizji pocisku / [EN] Bullet collision radius

// ==========================================
// 2. PLAYER CONSTRUCTOR / KONSTRUKTOR GRACZA
// ==========================================

/**
 * [PL] Obiekt gracza przechowujący pozycję i rotację.
 * [EN] Player object storing position and rotation.
 */
function player(x, y, z, rx, ry) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.rx = rx;
    this.ry = ry;
}

// [PL] Inicjalizacja gracza w punkcie startowym / [EN] Player initialization at spawn point
var pawn = new player(0, 0, -1150, 0, 180);


// ==========================================
// 3. EVENT LISTENERS / NASŁUCHIWANIE ZDARZEŃ
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    updateHealthUI();
    updateAmmoUI();
    showWeaponState("Gotowy do strzału");
});

// [PL] Obsługa wciskania klawiszy / [EN] Keydown handler
document.addEventListener("keydown", (event) => {
    if (event.repeat) return; // [PL] Zabezpieczenie przed spamowaniem / [EN] Anti-spam protection

    if (event.key === "w") PressForward = 1;
    if (event.key === "s") PressBack = 1;
    if (event.key === "d") PressRight = 1;
    if (event.key === "a") PressLeft = 1;
    if (event.key === " ") PressUp = 1;
    
    // [PL] Logika aktywacji sprintu / [EN] Sprint activation logic
    if (event.key === "q") {
        handleSprintActivation();
    }
});

// [PL] Obsługa zwalniania klawiszy / [EN] Keyup handler
document.addEventListener("keyup", (event) => {
    if (event.key === "w") PressForward = 0;
    if (event.key === "s") PressBack = 0;
    if (event.key === "d") PressRight = 0;
    if (event.key === "a") PressLeft = 0;
    if (event.key === " ") PressUp = 0;
    
    // [PL] Przerwanie sprintu / [EN] Stop sprinting
    if (event.key === "q") {
        handleSprintDeactivation();
    }
});

// [PL] Blokada kursora myszy na kontenerze gry / [EN] Mouse pointer lock on game container
container.addEventListener('click', () => {
    if (canlock && document.pointerLockElement !== container) {
        container.requestPointerLock();
    }
});

// [PL] Nasłuchiwacz stanu blokady kursora / [EN] Pointer lock state change listener
document.addEventListener("pointerlockchange", () => {
    if (document.pointerLockElement === container) {
        lock = true;
    } else {
        lock = false;
        // [PL] Zatrzymanie ruchu po wyjściu z gry / [EN] Stop movement when unlocked
        PressForward = PressBack = PressLeft = PressRight = 0; 
    }
});

// [PL] Pobieranie wektora ruchu myszy / [EN] Mouse movement vector capture
document.addEventListener("mousemove", (event) => {
    MouseX = event.movementX;
    MouseY = event.movementY;
});

// [PL] Strzał lewym przyciskiem myszy / [EN] Left mouse button shooting
document.addEventListener('mousedown', (event) => {
    if (lock && event.button === 0) { 
        attemptFire();
    }
});


// ==========================================
// 4. SPRINT LOGIC / LOGIKA SPRINTU
// ==========================================

function handleSprintActivation() {
    if (coinsCount > 0) {
        PressSprint = 5; 
        showInGameMessage("fast speed<br><span id='sprintCountdown' style='font-size: 80px; color: #fff;'>" + (sprintTimeLeft / 1000).toFixed(2) + "</span>", "#00ffff", 999999); 

        if (sprintTimer === null) {
            sprintTimer = setInterval(() => {
                sprintTimeLeft -= 10; 
                
                if (sprintTimeLeft > 0) {
                    let countdownUI = document.getElementById("sprintCountdown");
                    if (countdownUI) countdownUI.innerText = (sprintTimeLeft / 1000).toFixed(2);
                } else {
                    consumeCoinForSprint();
                }
            }, 10); 
        }
    } else {
        showInGameMessage("NO COINS FOR SPEED!", "#ff0000", 2000);
    }
}

function consumeCoinForSprint() {
    coinsCount--; 
    let ui = document.getElementById("coinCountUI");
    if (ui) ui.innerText = coinsCount;
    
    // --- AKTUALIZACJA PUNKTÓW (bo wydaliśmy monetę na sprint) ---
    if (typeof updateScoreUI === "function") updateScoreUI();

    if (coinsCount > 0) {
        sprintTimeLeft = 1000;
        let countdownUI = document.getElementById("sprintCountdown");
        if (countdownUI) countdownUI.innerText = (sprintTimeLeft / 1000).toFixed(2);
    } else {
        handleSprintDeactivation();
        sprintTimeLeft = 1000; 
        showInGameMessage("OUT OF COINS!", "#ff0000", 3000);
    }
}

function handleSprintDeactivation() {
    PressSprint = 1; 
    if (sprintTimer !== null) {
        clearInterval(sprintTimer);
        sprintTimer = null;
    }
    
    let msgBox = document.getElementById("gameMessages");
    if (msgBox && msgBox.innerHTML.includes("sprintCountdown")) {
        msgBox.style.display = "none";
    }
}


// ==========================================
// 5. MATH & COORDINATE TRANSFORMS / MATEMATYKA I TRANSFORMACJE KRYCIA
// ==========================================

/**
 * [PL] Transformacja lokalnych współrzędnych 3D na globalne.
 * [EN] Transforms local 3D coordinates into global coordinates.
 */
function coorTransform(x0, y0, z0, rxc, ryc, rzc) {
    let x1 =  x0;
    let y1 =  y0 * Math.cos(rxc * dag) + z0 * Math.sin(rxc * dag);
    let z1 = -y0 * Math.sin(rxc * dag) + z0 * Math.cos(rxc * dag);
    
    let x2 =  x1 * Math.cos(ryc * dag) - z1 * Math.sin(ryc * dag);
    let y2 =  y1;
    let z2 =  x1 * Math.sin(ryc * dag) + z1 * Math.cos(ryc * dag);
    
    let x3 =  x2 * Math.cos(rzc * dag) + y2 * Math.sin(rzc * dag);
    let y3 = -x2 * Math.sin(rzc * dag) + y2 * Math.cos(rzc * dag);
    let z3 =  z2;
    
    return [x3, y3, z3];
}

/**
 * [PL] Odwrotna transformacja z globalnych na lokalne (używane do kolizji rotowanych obiektów).
 * [EN] Inverse transformation from global to local (used for rotated objects collisions).
 */
function coorReTransform(x3, y3, z3, rxc, ryc, rzc) {
    let x2 =  x3 * Math.cos(rzc * dag) - y3 * Math.sin(rzc * dag);
    let y2 =  x3 * Math.sin(rzc * dag) + y3 * Math.cos(rzc * dag);
    let z2 =  z3;
    
    let x1 =  x2 * Math.cos(ryc * dag) + z2 * Math.sin(ryc * dag);
    let y1 =  y2;
    let z1 = -x2 * Math.sin(ryc * dag) + z2 * Math.cos(ryc * dag);
    
    let x0 =  x1;
    let y0 =  y1 * Math.cos(rxc * dag) - z1 * Math.sin(rxc * dag);
    let z0 =  y1 * Math.sin(rxc * dag) + z1 * Math.cos(rxc * dag);
    
    return [x0, y0, z0];
}


// ==========================================
// 6. MAIN GAME LOOP / GŁÓWNA PĘTLA GRY
// ==========================================

/**
 * [PL] Główna pętla wywoływana cyklicznie. Zawiaduje ruchem, fizyką, kamerą i AI.
 * [EN] Main game loop called cyclically. Manages movement, physics, camera, and AI.
 */
function update() {
    applyPlayerPhysics();
    updateCameraAndWorld();
    animateEntities();
    
    if (typeof checkCollections === "function") {
        checkCollections();
        updateBullets();
    }
    
    if (typeof enemies !== "undefined") {
        updateEnemiesLogic();
    }
}

// ==========================================
// 7. CORE LOGIC MODULES / MODUŁY LOGIKI
// ==========================================

/**
 * [PL] Oblicza ruch gracza, grawitację, odrzut oraz wykrywa kolizje ze środowiskiem.
 * [EN] Calculates player movement, gravity, knockback, and detects environment collisions.
 */
function applyPlayerPhysics() {
    // 1. Obliczanie wektora ruchu / Movement vector calculation
    let dx = (Math.cos(pawn.ry * dag) * (PressRight - PressLeft) - 
              Math.sin(pawn.ry * dag) * (PressForward - PressBack)) * PressSprint;
    let dz = (-Math.sin(pawn.ry * dag) * (PressRight - PressLeft) -
               Math.cos(pawn.ry * dag) * (PressForward - PressBack)) * PressSprint;
    
    // 2. Aplikacja fizyki odrzutu i tarcia / Apply knockback physics and friction
    dx += playerKnockbackX;
    dz += playerKnockbackZ;
    playerKnockbackX *= 0.96; 
    playerKnockbackZ *= 0.96;

    // 3. Rozwiązywanie kolizji w osiach X i Z / X and Z axis collision resolution
    let nextX = pawn.x + dx;
    let nextZ = pawn.z + dz;

    if (!checkCollision(nextX, pawn.z)) pawn.x = nextX;
    if (!checkCollision(pawn.x, nextZ)) pawn.z = nextZ;

    // 4. Dynamiczna Grawitacja i Platformy / Dynamic Gravity and Platforms
    let groundLevel = 0; // [PL] Domyślny poziom podłogi / [EN] Default ground level

    for (let i = 0; i < map.length; i++) {
        let wall = map[i];
        
        // [PL] Reaguje tylko na płaskie platformy (rx = 90) / [EN] Only reacts to flat platforms
        if (wall[3] === 90) {
            let wX = wall[0], wY = wall[1], wZ = wall[2];
            let width = wall[6], depth = wall[7]; 

            // [PL] Czy gracz jest nad platformą? / [EN] Is player within platform bounds?
            if (pawn.x > wX - width / 2 && pawn.x < wX + width / 2 &&
                pawn.z > wZ - depth / 2 && pawn.z < wZ + depth / 2) {
                
                let calculatedGround = wY - 100;
                
                // [PL] Ignoruj sufity, łap tylko podłogę / [EN] Ignore ceilings, catch floors only
                if (calculatedGround >= pawn.y - 40) {
                    if (calculatedGround < groundLevel) {
                        groundLevel = calculatedGround;
                    }
                }
            }
        }
    }

    // 5. System skakania / Jumping system
    if (PressUp === 1 && pawn.y >= groundLevel) {
        vy = -7; 
    }

    vy += gravity;
    let nextY = pawn.y + vy;

    if (nextY >= groundLevel) {
        nextY = groundLevel;
        vy = 0;
    }
    pawn.y = nextY;
}

/**
 * [PL] Obsługuje ruch myszy i przesuwa przestrzeń 3D wokół kamery.
 * [EN] Handles mouse movement and moves the 3D space around the camera.
 */
function updateCameraAndWorld() {
    let drx = MouseY / 4;
    let dry = -MouseX / 4;
    MouseX = 0;
    MouseY = 0;

    if (lock) {
        pawn.rx = Math.max(-90, Math.min(90, pawn.rx + drx));
        pawn.ry = pawn.ry + dry;
    }
    
    // [PL] Aplikacja CSS do głównego kontenera / [EN] Apply CSS to the main container
    world.style.transform = "translateZ(600px)" + 
                            "rotateX(" + (-pawn.rx) + "deg)" +
                            "rotateY(" + (-pawn.ry) + "deg)" +
                            "translate3d(" + (-pawn.x) + "px," + (-pawn.y) + "px," + (-pawn.z) + "px)";
}

/**
 * [PL] Animuje przedmioty kolekcjonerskie (monety, klucze, magazynki i portal).
 * [EN] Animates collectible entities (coins, keys, mags, and portal).
 */
function animateEntities() {
    const rotateEntity = (array, prefix) => {
        if (typeof array !== "undefined") {
            for (let i = 0; i < array.length; i++) {
                if (array[i][2] !== 1000000 && array[i][0] !== 1000000) { 
                    array[i][4] += 1; // [PL] Inkrementacja kąta Y / [EN] Increment Y angle
                    let el = document.getElementById(prefix + i) || document.getElementById(prefix + "s" + i);
                    if (el) {
                        el.style.transform = 
                            "translate3d(" + 
                                (600 - array[i][6]/2 + array[i][0]) + "px," + 
                                (400 - array[i][7]/2 + array[i][1]) + "px," + 
                                array[i][2] + "px)" +
                                "rotateX(" + array[i][3] + "deg)" + 
                                "rotateY(" + array[i][4] + "deg)" +
                                "rotateZ(" + array[i][5] + "deg)";
                    }
                }
            }
        }
    };

    rotateEntity(coins, "coin");
    rotateEntity(keys, "key");
    rotateEntity(mags, "mag");

    if (typeof finish !== "undefined" && finish.length > 0) {
        finish[0][5] += 1; 
        let portal = document.getElementById("portal0");
        if (portal) {
            portal.style.transform = 
                "translate3d(" + 
                    (600 - finish[0][6]/2 + finish[0][0]) + "px," + 
                    (400 - finish[0][7]/2 + finish[0][1]) + "px," + 
                    finish[0][2] + "px)" +
                    "rotateX(" + finish[0][3] + "deg)" + 
                    "rotateY(" + finish[0][4] + "deg)" +
                    "rotateZ(" + finish[0][5] + "deg)";
        }
    }
}

/**
 * [PL] Moduł sztucznej inteligencji. Obsługuje przemieszczanie wrogów i ataki.
 * [EN] Artificial Intelligence module. Handles enemy movement and attacks.
 */
function updateEnemiesLogic() {
    let playerHitRadius = 30; 

    for (let i = 0; i < enemies.length; i++) {
        if (enemies[i][0] === 1000000) continue; 
        
        enemies[i][4] += 1; // [PL] Obracanie się tarczy / [EN] Rotate the target

        // [PL] Inicjalizacja wektora ruchu / [EN] Movement vector initialization
        if (enemies[i][10] === undefined) {
            let randomAngle = Math.random() * Math.PI * 2; 
            let speed = 1.2; 
            enemies[i][10] = Math.cos(randomAngle) * speed; 
            enemies[i][11] = Math.sin(randomAngle) * speed; 
        }

        let vx = enemies[i][10];
        let vz = enemies[i][11];
        let nextEnemyX = enemies[i][0] + vx;
        let nextEnemyZ = enemies[i][2] + vz;

        // --- ENEMY TO ENEMY COLLISION / KOLIZJE MIĘDZY WROGAMI ---
        let hitOtherEnemyX = false;
        let hitOtherEnemyZ = false;
        let myRadius = enemies[i][6] / 2;

        for (let j = 0; j < enemies.length; j++) {
            if (i !== j && enemies[j][0] !== 1000000) {
                let otherRadius = enemies[j][6] / 2;
                let minDist = (myRadius + otherRadius) * 0.8; 

                if (Math.hypot(nextEnemyX - enemies[j][0], enemies[i][2] - enemies[j][2]) < minDist) hitOtherEnemyX = true;
                if (Math.hypot(enemies[i][0] - enemies[j][0], nextEnemyZ - enemies[j][2]) < minDist) hitOtherEnemyZ = true;
            }
        }

        // [PL] Odbicia od ścian i kolegów / [EN] Bounces off walls and other enemies
        if (hitOtherEnemyX || (typeof checkEnemyCollision === "function" && checkEnemyCollision(nextEnemyX, enemies[i][1], enemies[i][2]))) {
            enemies[i][10] = -vx; 
            nextEnemyX = enemies[i][0] + enemies[i][10]; 
        }
        
        if (hitOtherEnemyZ || (typeof checkEnemyCollision === "function" && checkEnemyCollision(enemies[i][0], enemies[i][1], nextEnemyZ))) {
            enemies[i][11] = -vz; 
            nextEnemyZ = enemies[i][2] + enemies[i][11]; 
        }

        enemies[i][0] = nextEnemyX;
        enemies[i][2] = nextEnemyZ;

        // --- PLAYER DAMAGE LOGIC / ZADAWANIE OBRAŻEŃ GRACZOWI ---
        let edx = pawn.x - enemies[i][0];
        let edz = pawn.z - enemies[i][2];
        let dist = Math.sqrt(edx * edx + edz * edz);
        let enemyHitRadius = enemies[i][6] / 2;

        if (dist < (playerHitRadius + enemyHitRadius)) {
            if (!isInvulnerable) { 
                playerHealth--;
                updateHealthUI();
                
                if (playerHealth <= 0) {
                    if (typeof showInGameMessage === "function") showInGameMessage("YOU DIED!", "#ff0000", 5000);
                    setTimeout(() => location.reload(), 2000);
                } else {
                    // [PL] Zastosuj odrzut / [EN] Apply knockback vector
                    playerKnockbackX = (edx / dist) * 10; 
                    playerKnockbackZ = (edz / dist) * 10;
                    
                    isInvulnerable = true;
                    setTimeout(() => { isInvulnerable = false; }, 1000);
                }
            }
        }

        // [PL] Render wroga / [EN] Render enemy position
        let enemyElement = document.getElementById("enemy" + i);
        if (enemyElement) {
            enemyElement.style.transform = 
                "translate3d(" + 
                    (600 - enemies[i][6]/2 + enemies[i][0]) + "px," + 
                    (400 - enemies[i][7]/2 + enemies[i][1]) + "px," + 
                    enemies[i][2] + "px)" +
                    "rotateX(" + enemies[i][3] + "deg)" + 
                    "rotateY(" + enemies[i][4] + "deg)" +
                    "rotateZ(" + enemies[i][5] + "deg)";
        }
    }
}


// ==========================================
// 8. COMBAT & WEAPONS / WALKA I BROŃ
// ==========================================

function attemptFire() {
    if (!canShoot || isReloading) return;

    if (currentBullets > 0) {
        fireBullet();
        currentBullets--;
        updateAmmoUI();

        if (currentBullets === 0) {
            if (spareMagazines > 0) reloadWeapon();
            else showWeaponState("Brak amunicji w zapasie!");
        } else {
            canShoot = false;
            showWeaponState("Odciąganie kurka...");
            setTimeout(() => {
                canShoot = true;
                if (!isReloading) showWeaponState("Gotowy do strzału");
            }, 500); 
        }
    } else if (spareMagazines > 0 && !isReloading) {
        reloadWeapon();
    } else {
        showWeaponState("Brak amunicji w zapasie!");
    }
}

function fireBullet() {
    let dirX = -Math.sin(pawn.ry * dag) * Math.cos(pawn.rx * dag);
    let dirY =  Math.sin(pawn.rx * dag);
    let dirZ = -Math.cos(pawn.ry * dag) * Math.cos(pawn.rx * dag);

    let newBullet = {
        id: "bullet_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
        x: pawn.x,
        y: pawn.y - 40, 
        z: pawn.z,
        dx: dirX * bulletSpeed,
        dy: dirY * bulletSpeed,
        dz: dirZ * bulletSpeed,
        life: 100 
    };

    bullets.push(newBullet);

    let bulletDiv = document.createElement("div");
    bulletDiv.className = "bullet square";
    bulletDiv.id = newBullet.id;
    bulletDiv.style.width = (bulletRadius * 2) + "px";
    bulletDiv.style.height = (bulletRadius * 2) + "px";
    world.appendChild(bulletDiv);
}

function reloadWeapon() {
    isReloading = true;
    canShoot = false;
    spareMagazines--; 
    showWeaponState("Wymiana bębna...");
    updateAmmoUI();
    
    if (typeof showInGameMessage === "function") {
        showInGameMessage("RELOADING...", "#e74c3c", 2000);
    }
    
    setTimeout(() => {
        currentBullets = maxBullets;
        isReloading = false;
        canShoot = true;
        showWeaponState("Gotowy do strzału");
        updateAmmoUI();
    }, 2000); 
}

function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        let b = bullets[i];
        
        b.x += b.dx;
        b.y += b.dy;
        b.z += b.dz;
        b.life--;

        let bulletDiv = document.getElementById(b.id);
        let hitWall = checkBulletCollision(b.x, b.y, b.z);
        let hitEnemy = false;

        if (typeof enemies !== "undefined") {
            for (let j = 0; j < enemies.length; j++) {
                if (enemies[j][0] !== 1000000) {
                    let dist = Math.hypot(b.x - enemies[j][0], b.y - enemies[j][1], b.z - enemies[j][2]);
                    let hitRadius = enemies[j][6] / 2;
                    
                    if (dist < hitRadius) {
                        hitEnemy = true;
                        enemies[j][9] -= 1; 
                        let currentHp = enemies[j][9]; 
                        
                        let enemyDiv = document.getElementById("enemy" + j);
                        let hBarContainer = document.getElementById("healthBar_enemy" + j);
                        
                        // [PL] Odświeżenie paska życia / [EN] Health bar refresh
                        if (hBarContainer && currentHp >= 0) {
                            let frontBar = hBarContainer.children[0];
                            let backBar = hBarContainer.children[1];
                            
                            const turnOffDot = (bar) => {
                                if (bar && bar.children[currentHp]) {
                                    let dot = bar.children[currentHp];
                                    dot.style.backgroundColor = "transparent";
                                    dot.style.boxShadow = "none";
                                    dot.style.border = "2px solid #ff0000";
                                }
                            };
                            turnOffDot(frontBar);
                            turnOffDot(backBar);
                        }
                        
						// [PL] Śmierć wroga / [EN] Enemy death handling
							if (currentHp <= 0) {
                            let ex = enemies[j][0], ey = enemies[j][1], ez = enemies[j][2];
                            enemies[j][0] = 1000000; 
                            
                            // --- DODAWANIE PUNKTÓW ZA ZABICIE ---
                            let maxHp = enemiesArray[level][j][9]; 
                            let points = maxHp * 100; 
                            enemiesScore += points;
                            
                            // --- AKTUALIZACJA PUNKTÓW NA UI ---
                            if (typeof updateScoreUI === "function") updateScoreUI();
                            
                            if (typeof showInGameMessage === "function") {
                                showInGameMessage("ENEMY DOWN! +" + points, "#00ff00", 1500);
                            }
                            // ------------------------------------------

                            if (enemyDiv) {
                                if (hBarContainer) hBarContainer.style.display = "none";
                                enemyDiv.style.transition = "scale 2s ease-in"; 
                                enemyDiv.style.scale = "0";
                                
                                setTimeout(() => {
                                    spawnExplosion(ex, ey, ez);
                                    enemyDiv.style.display = "none";
                                }, 2000);
                            } else {
                                spawnExplosion(ex, ey, ez);
                            }
                        } else {
                            // [PL] Efekt trafienia / [EN] Hit flash effect
                            if (enemyDiv) {
                                enemyDiv.style.filter = "brightness(3) sepia(1) hue-rotate(-50deg) saturate(5)";
                                setTimeout(() => { if(enemyDiv) enemyDiv.style.filter = "none"; }, 150);
                            }
                        }
                        break; 
                    }
                }
            }
        }

        if (hitWall || hitEnemy || b.life <= 0) {
            if (bulletDiv) bulletDiv.remove(); 
            bullets.splice(i, 1);              
            continue;
        }

        if (bulletDiv) {
            bulletDiv.style.transform = 
                "translate3d(" + (600 - bulletRadius + b.x) + "px," + 
                                 (400 - bulletRadius + b.y) + "px," + 
                                 b.z + "px)";
        }
    }
}


// ==========================================
// 9. COLLISION DETECTION / SYSTEMY KOLIZJI
// ==========================================

function checkCollision(newX, newZ) {
    let playerRadius = 30;
    let wallThickness = 20;

    for (let i = 0; i < map.length; i++) {
        let wall = map[i];
        if (wall[3] === 90 || wall[1] < -40) continue; 

        let localCoords = coorReTransform(newX - wall[0], pawn.y - wall[1], newZ - wall[2], wall[3], wall[4], wall[5]);
        let localX = localCoords[0], localY = localCoords[1], localZ = localCoords[2];

        let localHead = localY; 
        let localFeet = localY + 100; 

        let newCollides = (localX + playerRadius > -wall[6] / 2 && 
                           localX - playerRadius < wall[6] / 2 &&
                           localZ + playerRadius > -wallThickness && 
                           localZ - playerRadius < wallThickness &&
                           localFeet > -wall[7] / 2 + 5 &&  
                           localHead < wall[7] / 2 - 5);

        if (newCollides) {
            let oldLocal = coorReTransform(pawn.x - wall[0], pawn.y - wall[1], pawn.z - wall[2], wall[3], wall[4], wall[5]);
            let oldCollides = (oldLocal[0] + playerRadius > -wall[6] / 2 && oldLocal[0] - playerRadius < wall[6] / 2 &&
                               oldLocal[2] + playerRadius > -wallThickness && oldLocal[2] - playerRadius < wallThickness &&
                               localFeet > -wall[7] / 2 + 5 && localHead < wall[7] / 2 - 5);
            if (oldCollides) continue;
            return true; 
        }
    }
    return false;
}

function checkEnemyCollision(newX, newY, newZ) {
    let enemyRadius = 35; 
    let wallThickness = 20;

    for (let i = 0; i < map.length; i++) {
        let wall = map[i];
        if (wall[3] === 90 || wall[1] < -40) continue; 

        let local = coorReTransform(newX - wall[0], newY - wall[1], newZ - wall[2], wall[3], wall[4], wall[5]);
        let localFeet = local[1] + 100; 

        if (local[0] + enemyRadius > -wall[6] / 2 && local[0] - enemyRadius < wall[6] / 2 &&
            local[2] + enemyRadius > -wallThickness && local[2] - enemyRadius < wallThickness &&
            localFeet > -wall[7] / 2 + 5 && local[1] < wall[7] / 2 - 5) {
            return true; 
        }
    }
    return false;
}

function checkBulletCollision(bx, by, bz) {
    let wallThickness = 20;

    for (let i = 0; i < map.length; i++) {
        let wall = map[i];
        let local = coorReTransform(bx - wall[0], by - wall[1], bz - wall[2], wall[3], wall[4], wall[5]);

        if (local[0] > -wall[6] / 2 && local[0] < wall[6] / 2 &&
            local[1] > -wall[7] / 2 && local[1] < wall[7] / 2 &&
            local[2] > -wallThickness && local[2] < wallThickness) {
            return true; 
        }
    }
    return false;
}


// ==========================================
// 10. COLLECTIONS & UI / ZBIERANIE I INTERFEJS
// ==========================================
function checkCollections() {
    let radius = 60; 

    // Helper: Odświeżenie kolekcji / Helper: Refresh collection status
    const collectItem = (items, i, action) => {
        if (items[i][2] !== 1000000) {
            // Liczymy tylko dystans 2D (X oraz Z), ignorując różnicę wysokości (Y)
            let dist = Math.hypot(pawn.x - items[i][0], pawn.z - items[i][2]);
            if (dist < radius) {
                items[i][2] = 1000000; 
                action();
            }
        }
    };

    // [PL] Zbieranie monet / [EN] Collecting coins
    for (let i = 0; i < coins.length; i++) {
        if (coins[i][2] !== 1000000) { 
            if (Math.hypot(pawn.x - coins[i][0], pawn.z - coins[i][2]) < radius) {
                coins[i][2] = 1000000; 
                let coinElement = document.getElementById("coin" + i);
                if (coinElement) coinElement.style.display = "none";
                
                // Odtwarzanie dźwięku
                if (typeof coinCollectSound !== 'undefined') {
                    coinCollectSound.currentTime = 0;
                    coinCollectSound.play();
                }
                
                coinsCount++;
                let ui = document.getElementById("coinCountUI");
                if (ui) ui.innerText = coinsCount;
                
                // --- AKTUALIZACJA PUNKTÓW NA ŻYWO ---
                if (typeof updateScoreUI === "function") updateScoreUI();
                
                if (typeof showInGameMessage === "function") {
                    if (coinsCount === coins.length) showInGameMessage("Great! All coins are collected!", "#00ff00", 5000); 
                    else showInGameMessage("C O I N", "#ffff00", PressSprint === 5 ? 600 : 800); 
                }
            }
        }
    }

    // [PL] Zbieranie kluczy / [EN] Collecting keys
    for (let i = 0; i < keys.length; i++) {
        collectItem(keys, i, () => {
            let keyElement = document.getElementById("key" + i);
            if (keyElement) keyElement.style.display = "none";
            
            // Odtwarzanie dźwięku dla klucza
            if (typeof coinCollectSound !== 'undefined') {
                coinCollectSound.currentTime = 0;
                coinCollectSound.play();
            }
            
            keysCount++;
            let ui = document.getElementById("keyCountUI");
            if (ui) ui.innerText = keysCount + " / " + keys.length;
            if (typeof showInGameMessage === "function") showInGameMessage("K E Y", "#00ffff", 800); 
        });
    }

    // [PL] Zbieranie magazynków / [EN] Collecting magazines
    if (typeof mags !== "undefined") {
        for (let i = 0; i < mags.length; i++) {
            collectItem(mags, i, () => {
                let magElement = document.getElementById("mag" + i);
                if (magElement) magElement.style.display = "none"; 
                
                // Odtwarzanie dźwięku dla magazynka
                if (typeof coinCollectSound !== 'undefined') {
                    coinCollectSound.currentTime = 0;
                    coinCollectSound.play();
                }
                
                spareMagazines++;
                if (typeof updateAmmoUI === "function") updateAmmoUI();
                if (typeof showInGameMessage === "function") showInGameMessage("MAGAZINE +1", "#00ff00", 1500); 
            });
        }
    }
}
function updateHealthUI() {
    let healthUI = document.getElementById("healthUI");
    if (healthUI) {
        let heartsHtml = "";
        for (let i = 0; i < playerMaxHealth; i++) {
            heartsHtml += (i < playerHealth) ? "❤️" : "🖤"; 
        }
        healthUI.innerHTML = heartsHtml;
    }
}

function updateAmmoUI() {
    let ammoContainer = document.getElementById("ammoContainer");
    let magsContainer = document.getElementById("magsContainer");
    
    if (ammoContainer) {
        ammoContainer.innerHTML = ""; 
        for (let i = 0; i < currentBullets; i++) {
            let bulletIcon = document.createElement("img");
            bulletIcon.src = "Patterns/ammo.png"; 
            bulletIcon.style.height = "26px";
            bulletIcon.style.marginRight = "5px";
            bulletIcon.style.verticalAlign = "middle";
            ammoContainer.appendChild(bulletIcon);
        }
    }
    
    if (magsContainer) {
        magsContainer.innerHTML = ""; 
        for (let i = 0; i < spareMagazines; i++) {
            let magIcon = document.createElement("img");
            magIcon.src = "Patterns/drum.png"; 
            magIcon.style.height = "26px";
            magIcon.style.marginRight = "5px";
            magIcon.style.verticalAlign = "middle";
            magsContainer.appendChild(magIcon);
        }
    }
}

function showWeaponState(msg) {
    let ch = document.getElementById("crosshair");
    if (ch) {
        ch.classList.remove("red", "cooling", "reloading-anim");
        if (msg === "Odciąganie kurka...") ch.classList.add("red", "cooling");
        else if (msg === "Wymiana bębna...") ch.classList.add("red", "reloading-anim");
        else if (msg !== "Gotowy do strzału") ch.classList.add("red");
    }
}


// ==========================================
// 11. WORLD GENERATION & DOM / GENEROWANIE ŚWIATA I DOM
// ==========================================

function CreateNewWorld(map){
    CreateSquares(map, "map");
}

function CreateSquares(squares, string){
    for (let i = 0; i < squares.length; i++) {
        let newElement = document.createElement("div");
        newElement.className = string + " square";
        newElement.id = string + i;
        newElement.style.width = squares[i][6] + "px";
        newElement.style.height = squares[i][7] + "px";

        newElement.style.transform = 
                    "translate3d(" + 
                        (600 - squares[i][6]/2 + squares[i][0]) + "px," + 
                        (400 - squares[i][7]/2 + squares[i][1]) + "px," + 
                        squares[i][2] + "px)" +
                        "rotateX(" + squares[i][3] + "deg)" + 
                        "rotateY(" + squares[i][4] + "deg)" + 
                        "rotateZ(" + squares[i][5] + "deg)";

        if (string === "coin" || string.includes("key") || string === "mag") {
            newElement.style.transformStyle = "preserve-3d"; 
            newElement.style.backgroundColor = "transparent";
            newElement.style.backgroundImage = "none"; 
            
            // OPTYMALIZACJA: Monety dostają tylko 3 warstwy: Z=-1, Z=0, Z=1.
            // Zbliżenie ich do siebie likwiduje prześwit, a 3 warstwy nie dławią procesora.
            let start = string === "mag" ? -4 : (string === "coin" ? -1 : -1.5);
            let end = string === "mag" ? 4 : (string === "coin" ? 1 : 1.5);
            let step = string === "mag" ? 2 : (string === "coin" ? 1 : 1.5); 
            
            for (let j = start; j <= end; j += step) { 
                let layer = document.createElement("div");
                layer.className = string === "key" ? "key-layer" : "coin-layer";
                layer.style.backgroundImage = "url(" + squares[i][8] + ")";
                
                // Ujednolicona transformacja bez rotateY(180deg) likwiduje "bicie" asymetrycznych grafik
                layer.style.transform = "translateZ(" + j + "px)";
                
                if (j === start || j === end) { 
                    if (string.includes("key")) {
                        layer.style.filter = "drop-shadow(0 0 10px gold) drop-shadow(0 0 15px yellow)";
                    }
                } else {
                    // Środkowa warstwa jest przyciemniana, by symulować fizyczną krawędź przedmiotu
                    layer.style.filter = "brightness(0.35)"; 
                    layer.style.backgroundColor = "transparent"; 
                }
                newElement.appendChild(layer);
            }
        } else { 
            newElement.style.background = squares[i][8];
            newElement.style.backgroundImage = "url(" + squares[i][8] + ")";
            newElement.style.opacity = squares[i][9];
            newElement.style.borderRadius = squares[i][9] + "%";
        }
        
        world.append(newElement);
    }
}

function CreateEnemies(enemiesList) {
    for (let i = 0; i < enemiesList.length; i++) {
        let newElement = document.createElement("div");
        newElement.className = "enemy square";
        newElement.id = "enemy" + i;
        newElement.style.width = enemiesList[i][6] + "px";
        newElement.style.height = enemiesList[i][7] + "px";

        newElement.style.transform = 
            "translate3d(" + 
                (600 - enemiesList[i][6]/2 + enemiesList[i][0]) + "px," + 
                (400 - enemiesList[i][7]/2 + enemiesList[i][1]) + "px," + 
                enemiesList[i][2] + "px)" +
                "rotateX(" + enemiesList[i][3] + "deg)" + 
                "rotateY(" + enemiesList[i][4] + "deg)" + 
                "rotateZ(" + enemiesList[i][5] + "deg)";

        newElement.style.transformStyle = "preserve-3d"; 
        newElement.style.backgroundColor = "transparent";

        for (let j = -5; j <= 5; j += 1) { 
            let layer = document.createElement("div");
            layer.className = "enemy-layer";
            layer.style.backgroundImage = "url(" + enemiesList[i][8] + ")";
            
            if (j === -5) layer.style.transform = "translateZ(" + j + "px) rotateY(180deg)";
            else if (j === 5) layer.style.transform = "translateZ(" + j + "px)";
            else {
                layer.style.transform = "translateZ(" + j + "px)";
                layer.style.filter = "brightness(0.35)"; 
                layer.style.backgroundColor = "transparent"; 
            }
            newElement.appendChild(layer);
        }

        let hp = enemiesList[i][9];
        if (hp > 0) {
            let hBarContainer = document.createElement("div");
            hBarContainer.id = "healthBar_enemy" + i;
            hBarContainer.style.position = "absolute";
            hBarContainer.style.width = "100%";
            hBarContainer.style.height = "15px"; 
            hBarContainer.style.top = "-50px"; 
            hBarContainer.style.transformStyle = "preserve-3d";

            for (let side = 0; side < 2; side++) {
                let hBar = document.createElement("div");
                hBar.style.position = "absolute";
                hBar.style.width = "100%";
                hBar.style.height = "15px"; 
                hBar.style.display = "flex";
                hBar.style.justifyContent = "center";
                hBar.style.gap = "8px";
                hBar.style.transform = side === 0 ? "translateZ(25px)" : "rotateY(180deg) translateZ(25px)";
                
                for (let d = 0; d < hp; d++) {
                    let dot = document.createElement("div");
                    dot.style.width = "15px";
                    dot.style.height = "15px";
                    dot.style.borderRadius = "50%";
                    dot.style.backgroundColor = "#00ff00"; 
                    dot.style.boxShadow = "0 0 10px #00ff00";
                    dot.style.border = "2px solid transparent";
                    dot.style.transition = "0.2s all";
                    hBar.appendChild(dot);
                }
                hBarContainer.appendChild(hBar);
            }
            newElement.appendChild(hBarContainer);
        }
        world.append(newElement);
    }
}

function spawnExplosion(ex, ey, ez) {
    let blast = document.createElement("div");
    blast.className = "enemy-explosion square";
    
    blast.style.transform = 
        "translate3d(" + (600 - 75 + ex) + "px," + (400 - 75 + ey) + "px," + ez + "px) " +
        "rotateY(" + pawn.ry + "deg) " + 
        "rotateX(" + pawn.rx + "deg)";
    
    let blastInner = document.createElement("div");
    blastInner.className = "enemy-explosion-inner";
    blast.appendChild(blastInner);
    
    world.appendChild(blast);
    setTimeout(() => { if (blast) blast.remove(); }, 2000);
}

