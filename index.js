const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1253;
canvas.height = 650;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const menu = document.getElementById("menu");
const startButton = document.getElementById("startButton");
const optionsButton = document.getElementById("optionsButton");
const exitButton = document.getElementById("exitButton");

let gameStarted = false;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/background.png",
  scale: 1.25,
});

const shop = new Sprite({
  position: {
    x: 800,
    y: 250,
  },
  imageSrc: "./img/shop.png",
  scale: 2.75,
  framesMax: 6,
});

// const info1 = new Sprite({
//   position: {
//     x: 800,
//     y: 250,
//   },
//   imageSrc: "./img/p1/idle.png",
//   scale: 2.5,
//   framesMax: 8,
// });

// const info2 = new Sprite({
//   position: {
//     x: 300,
//     y: 250,
//   },
//   imageSrc: "./img/p2/idle.png",
//   scale: 2.5,
//   framesMax: 8,
// });

const player = new Fighter({
  position: {
    x: 300,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/p1/Idle.png",
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157,
  },
  sprites: {
    idle: {
      imageSrc: "./img/p1/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "./img/p1/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/p1/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/p1/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./img/p1/Attack1.png",
      framesMax: 6,
    },
    takeHit: {
      imageSrc: "./img/p1/Take Hit - white silhouette.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "./img/p1/Death.png",
      framesMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50,
    },
    width: 160,
    height: 50,
  },
});

const enemy = new Fighter({
  position: {
    x: 900,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  offset: {
    x: -50,
    y: 0,
  },
  imageSrc: "./img/p2/Idle.png",
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 167,
  },
  sprites: {
    idle: {
      imageSrc: "./img/p2/Idle.png",
      framesMax: 4,
    },
    run: {
      imageSrc: "./img/p2/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/p2/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/p2/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./img/p2/Attack1.png",
      framesMax: 4,
    },
    takeHit: {
      imageSrc: "./img/p2/Take hit white.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "./img/p2/Death.png",
      framesMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: -170,
      y: 50,
    },
    width: 170,
    height: 50,
  },
});

console.log(player);

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};

startButton.addEventListener("click", startGame);
optionsButton.addEventListener("click", showOptions);
exitButton.addEventListener("click", exitGame);

function startGame() {
  if (!gameStarted) {
    menu.style.display = "none";
    gameStarted = true;
  }

  decreaseTimer();
  function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    shop.update();
    c.fillStyle = "rgba(255, 255, 255, 0.15)";
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    // pergerakan p1
    if (keys.a.pressed && player.lastKey === "a") {
      player.velocity.x = -5;
      player.switchSprite("run");
    } else if (keys.d.pressed && player.lastKey === "d") {
      player.velocity.x = 5;
      player.switchSprite("run");
    } else {
      player.switchSprite("idle");
    }
    
    // loncat p1
    if (player.velocity.y < 0) {
      player.switchSprite("jump");
    } else if (player.velocity.y > 0) {
      player.switchSprite("fall");
    }

    // pergerakan p2
    if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
      enemy.velocity.x = -5;
      enemy.switchSprite("run");
    } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
      enemy.velocity.x = 5;
      enemy.switchSprite("run");
    } else {
      enemy.switchSprite("idle");
    }

    // loncat p2
    if (enemy.velocity.y < 0) {
      enemy.switchSprite("jump");
    } else if (enemy.velocity.y > 0) {
      enemy.switchSprite("fall");
    }

    // deteksi titik temu dan pengurangan nyawa
    if (
      rectangularCollision({
        rectangle1: player,
        rectangle2: enemy,
      }) &&
      player.isAttacking &&
      player.framesCurrent === 4
    ) {
      enemy.takeHit();
      player.isAttacking = false;

      gsap.to("#enemyHealth", {
        width: enemy.health + "%",
      });
    }

    // jika serangan meleset
    if (player.isAttacking && player.framesCurrent === 4) {
      player.isAttacking = false;
    }

    // hitbox
    if (
      rectangularCollision({
        rectangle1: enemy,
        rectangle2: player,
      }) &&
      enemy.isAttacking &&
      enemy.framesCurrent === 2
    ) {
      player.takeHit();
      enemy.isAttacking = false;

      gsap.to("#playerHealth", {
        width: player.health + "%",
      });
    }

    // jika meleset
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
      enemy.isAttacking = false;
    }

    // untuk menentukan pemenang
    if (enemy.health <= 0 || player.health <= 0) {
      determineWinner({ player, enemy, timerId });
    }
    function space(e) {
      if (e.keyCode == 32) {
          document.location.reload(); 
      }
    }
  }

  animate();

  //untuk kembali ke menu
  window.addEventListener("keydown", esc, false);
  function esc(e) {
    if (e.keyCode == 27) {
      document.location.reload();
      console.log("RESET");
    }
  }
  // Deklarasi jumlah lompatan dan maks nya
  var maxJumps = 1;
  var jumpCount = 0;
  var canJump = true;
  window.addEventListener("keydown", (event) => {
    if (!player.dead) {
      switch (event.key) {
        case "d":
          // jika player mencapai batas kanan canvas, player berhenti 
          if (player.position.x + player.width >= canvas.width - player.width) {
            keys.d.pressed = false;
            player.switchSprite("run");
        } else {
            keys.d.pressed = true;
            player.lastKey = "d";
            player.velocity.x = 5;
            player.switchSprite("run");
        }
          break;
        // jika player mencapai batas kiri canvas, player berhenti 
        case "a":
          if (player.position.x <= player.width - 10) { 
            keys.a.pressed = false;
            player.switchSprite("run");
        } else {
            keys.a.pressed = true;
            player.lastKey = "a";
            player.velocity.x = -5;
            player.switchSprite("run");
        }
          break;
        case "w":
          // Kondisi jika loncatan player belum sampe maks loncatan 
           if (canJump && jumpCount < maxJumps) {
              player.velocity.y = -16; 
              jumpCount++;
              // kondisi jika loncatan mencapai maks
              if (jumpCount == maxJumps) {
                  canJump = false;
              }
          }
          // Reset jumlah loncatan ketika menyentuh tanah
          if (player.position.y + player.height >= canvas.height - 53) {
            jumpCount = 0;
            canJump = true;
          }
          break;
        case "s":
          player.attack();
          break;
      }
    }
    
    if (!enemy.dead) {
      switch (event.key) {
        case "ArrowRight":
          // jika enemy mencapai batas kanan canvas, enemy berhenti 
          if (enemy.position.x + enemy.width >= canvas.width - enemy.width) {
            keys.ArrowRight.pressed = false;
            enemy.switchSprite("run");
        } else {
            keys.ArrowRight.pressed = true;
            enemy.lastKey = "ArrowRight";
            enemy.velocity.x = 5;
            enemy.switchSprite("run");
        }
          break;
        case "ArrowLeft":
           // jika enemy mencapai batas kiri canvas, enemy berhenti 
          if (enemy.position.x <= enemy.width - 10) { 
            keys.ArrowLeft.pressed = false;
            enemy.switchSprite("run");
        } else {
            keys.ArrowLeft.pressed = true;
            enemy.lastKey = "ArrowLeft";
            enemy.velocity.x = -5;
            enemy.switchSprite("run");
        }
          break;
        case "ArrowUp":
           // jika enemy mencapai batas kiri canvas, enemy berhenti 
          if (canJump && jumpCount < maxJumps) {
            enemy.velocity.y = -16; 
            jumpCount++;
            // kondisi jika loncatan mencapai maks
            if (jumpCount == maxJumps) {
                canJump = false;
            }
        }
        if (enemy.position.y + enemy.height >= canvas.height - 53) {
          jumpCount = 0;
          canJump = true;
        }
          break;
        case "ArrowDown":
          enemy.attack();

          break;
      }
    }
  });

  window.addEventListener("keyup", (event) => {
    switch (event.key) {
      case "d":
        keys.d.pressed = false;
        break;
      case "a":
        keys.a.pressed = false;
        break;
    }

    // enemy keys
    switch (event.key) {
      case "ArrowRight":
        keys.ArrowRight.pressed = false;
        break;
      case "ArrowLeft":
        keys.ArrowLeft.pressed = false;
        break;
    }
  });
}


//animasi gambar masih blm bisa
function showOptions() {
  const closeButton = document.querySelector(".close");
  const popUp = document.getElementById("myPopUp");

  popUp.style.display = "block";

  const info1 = new Sprite({
    position: {
      x: 300,
      y: 0,
    },
    velocity: {
      x: 0,
      y: 0,
    },
    offset: {
      x: 0,
      y: 0,
    },
    position: { x: 599, y: 400 }, // Sesuaikan dengan posisi yang diinginkan
    imageSrc: "./img/p1/idle.png",
    scale: 2.5, // Sesuaikan dengan skala yang diinginkan
    framesMax: 4, // Sesuaikan dengan jumlah frame maksimum
    sprites:{
      idle: {
        imageSrc: "./img/p1/Idle.png",
        framesMax: 8,
      },
    }
  });
  function animate() {
    window.requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    info1.draw(); // Perbarui sprite gambar bergerak
  }
  animate();
  closeButton.addEventListener("click", function () {
    popUp.style.display = "none";
  });
}

function exitGame() {
  // Mungkin menampilkan konfirmasi sebelum keluar
  if (confirm("Are you sure you want to exit the game?")) {
    // Keluar dari permainan (tutup tab atau jendela, dll.)
    window.close();
  }
}
