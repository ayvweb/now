// ===== Nickname logic =====
const nickDisplay = document.getElementById("current-nick");
const nickInput = document.getElementById("nickname-input");
const identityForm = document.getElementById("identity-form");
const resetNickBtn = document.getElementById("reset-nick");

function getNickname() {
  return localStorage.getItem("nickname") || "Human";
}
function setNickname(nick) {
  localStorage.setItem("nickname", nick || "Human");
  nickDisplay.textContent = "Current: " + getNickname();
  nickInput.value = "";
}

identityForm.addEventListener("submit", e => {
  e.preventDefault();
  setNickname(nickInput.value.trim());
});
resetNickBtn.addEventListener("click", () => {
  localStorage.removeItem("nickname");
  setNickname("");
});
setNickname(getNickname());

// ===== Wish submission =====
document.getElementById("wish-form").addEventListener("submit", e => {
  e.preventDefault();
  const wish = document.getElementById("wish-input").value.trim();
  if (!wish) return;
  const nickname = getNickname();

  db.ref("entries").push({
    nickname,
    wish,
    timestamp: Date.now()
  });

  document.getElementById("wish-input").value = "";
});

// ===== Display wishes =====
const entriesContainer = document.getElementById("entries");

db.ref("entries").limitToLast(50).on("child_added", snapshot => {
  const entry = snapshot.val();
  const id = snapshot.key;

  const div = document.createElement("div");
  div.className = "entry";
  div.innerHTML = `
    <strong>${entry.nickname}</strong>: ${entry.wish}
    <div class="comments" id="comments-${id}"></div>
    <form class="comment-form" data-id="${id}">
      <input placeholder="Comment…" maxlength="100"/>
      <button>Post</button>
    </form>
  `;
  entriesContainer.prepend(div);

  listenForComments(id);
});

// ===== Comment system =====
document.addEventListener("submit", e => {
  if (e.target.classList.contains("comment-form")) {
    e.preventDefault();
    const entryId = e.target.dataset.id;
    const input = e.target.querySelector("input");
    const comment = input.value.trim();
    if (!comment) return;
    const nickname = getNickname();

    db.ref(`comments/${entryId}`).push({
      nickname,
      comment,
      timestamp: Date.now()
    });

    input.value = "";
  }
});

function listenForComments(entryId) {
  const container = document.getElementById(`comments-${entryId}`);
  db.ref(`comments/${entryId}`).limitToLast(20).on("child_added", snapshot => {
    const c = snapshot.val();
    const p = document.createElement("p");
    p.className = "comment";
    p.textContent = `${c.nickname}: ${c.comment}`;
    container.appendChild(p);
  });
}

// ===== Starfield background =====
const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");
let stars = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  stars = Array.from({ length: 150 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    z: Math.random() * canvas.width
  }));
}
window.addEventListener("resize", resize);
resize();

function animate() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  for (let star of stars) {
    star.z -= 2;
    if (star.z <= 0) star.z = canvas.width;
    const k = 128.0 / star.z;
    const px = star.x * k + canvas.width / 2;
    const py = star.y * k + canvas.height / 2;
    if (px >= 0 && px <= canvas.width && py >= 0 && py <= canvas.height) {
      const size = (1 - star.z / canvas.width) * 2;
      ctx.fillRect(px, py, size, size);
    }
  }
  requestAnimationFrame(animate);
}
animate();
