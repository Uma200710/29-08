/* ======================================================
   DATOS — modificá acá el texto de cada razón, agregá o
   quitá "secret" para poner/quitar el botón "Un secretito"
   ====================================================== */
const reasons = [
  { id: 1,  text: "Porque hasta mi familia me nota más contenta desde que llegaste a mi vida" },
  { id: 2,  text: "Porque me alivianas hasta los peores días" },
  { id: 3,  text: "Porque me emociona poder llamarte mi novio o decirte \"amor\"" },
  { id: 4,  text: "Por la forma en la que me duele la cara de tanto sonreír después de vernos" },
  { id: 5,  text: "Porque veo todos los días como te esforzas por las cosas que te interesan" },
  { id: 6,  text: "Porque puedo hablar de cualquier tema con vos" },
  { id: 7,  text: "Porque desde que llegaste no hubo un día en el que me haya sentido sola" },
  { id: 8,  text: "El culo te abrocho (era necesario) 💗" },
  { id: 9,  text: "Porque me mostraste lo que es un amor lindo de verdad" },
  { id: 10, text: "Porque darte un beso es la sensación más linda del mundo" },
  { id: 11, text: "Porque adoro la forma en la que hablas" },
  { id: 12, text: "Porque me pareces precioso desde el primer momento en que te vi",
      secret: "Probablemente no lo sepas, o capaz que sí, pero realmente me pareces muy atractivo desde la primera vez que te vi, es por eso que aparecí de la nada entre tus seguidores de Instagram jej. Desgraciadamente (o por suerte), soy muy imbécil y nunca me animé a hablarte, pero para mí eso es lo de menos porque hoy estoy con un chico divino 💙" },
  { id: 13, text: "Porque sin saberlo, sos todo lo que necesitaba en mi vida y todo lo que deseo" },
  { id: 14, text: "Porque me enamora incluso la forma en la que me mirás" },
  { id: 15, text: "Porque sos ese lugar seguro que se siente como un \"hogar\" para mí" },
  { id: 16, text: "Porque compartir un deporte terminó siendo una excusa para encontrarnos" },
  { id: 17, text: "Porque no hay momento en el que no te piense" },
  { id: 18, text: "Porque todavía me emociono un poquito antes de verte" },
  { id: 19, text: "Porque siempre me alegro cuando veo tu mensaje de buenos días" },
  { id: 20, text: "Porque me encanta escucharte hablar de lo que te interesa" },
  { id: 21, text: "Porque adoro tu personalidad" },
  { id: 22, text: "Porque me parece tierno como siempre buscas agarrarme la mano" },
  { id: 23, text: "Porque me encanta compartir planes simples con vos" },
  { id: 24, text: "Porque mi razón favorita para amarte es porque sos vos" },
  { id: 25, text: "Porque no tengo que explicarte como quererme" },
  { id: 26, text: "Porque adoro que me acaricies el pelo aunque odio que otras personas lo hagan" },
  { id: 27, text: "Porque no quiero que me hagas falta nunca" },
  { id: 28, text: "Porque una parte de mí ya no sabe vivir sin vos" },
  { id: 29, text: "Porque todavía nos queda muchísimo por vivir juntos 💗" },
];

const finalLetter = {
  id: 30,
  lockedTitle: "30",
  unlockedTitle: "💌 Para vos",
  title: "Feliz primer mes, mi vida",
  paragraphs: [
    "No soy muy buena diciendo este tipo de cosas, pero con vos, quería hacer el intento.",
    "Aunque me cuesta muchísimo, quería que sepas todo lo lindo que me pasa con vos, y aunque hubiera escrito mil razones, nunca podría hacerte entender todo el amor que te tengo 💙."
    "Me di cuenta que te amaba porque por primera vez queria compartir mi vida con alguien, y ese alguien sos vos"
  ]
};

const TOTAL_TO_UNLOCK = reasons.length; // 29

/* ---------------- Persistencia ---------------- */
const STORAGE_KEY = "razones-leidas";

function loadRead() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch (e) {
    return new Set();
  }
}

function saveRead(set) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  } catch (e) { /* si falla, seguimos solo con memoria */ }
}

let readSet = loadRead();

/* ---------------- Rotación estable por papelito ---------------- */
function rotationFor(id) {
  // pseudo-random determinístico, siempre la misma rotación para el mismo id
  const seed = Math.sin(id * 999) * 10000;
  const frac = seed - Math.floor(seed);
  return (frac * 8 - 4).toFixed(2); // entre -4deg y 4deg
}

/* ---------------- Referencias DOM ---------------- */
const sceneCover = document.getElementById("scene-cover");
const sceneGrid  = document.getElementById("scene-grid");
const gridEl     = document.getElementById("grid");
const progressEl = document.getElementById("grid-progress");
const overlay    = document.getElementById("overlay");
const cardInner  = document.getElementById("card-inner");
const cardClose  = document.getElementById("card-close");
const btnEmpezar = document.getElementById("btn-empezar");

/* ---------------- Render de la cuadrícula ---------------- */
function renderGrid() {
  gridEl.innerHTML = "";

  reasons.forEach((r) => {
    const isRead = readSet.has(r.id);
    const div = document.createElement("div");
    div.className = "paper" + (isRead ? " read" : "");
    div.style.setProperty("--rot", rotationFor(r.id) + "deg");
    div.style.transform = `rotate(${rotationFor(r.id)}deg)`;
    div.dataset.id = r.id;
    div.innerHTML = `
      <span class="num">${r.id}</span>
      <span class="mark">❤️</span>
    `;
    div.addEventListener("click", () => openReason(r.id));
    gridEl.appendChild(div);
  });

  // papelito especial (30)
  const unlocked = readSet.size >= TOTAL_TO_UNLOCK;
  const special = document.createElement("div");
  special.className = "paper special " + (unlocked ? "unlocked" : "locked");
  special.innerHTML = unlocked
    ? `<span class="num">💌</span><span class="num" style="font-family:'Lora',serif;font-size:1rem;">Para vos</span>`
    : `<span class="num">🔒</span><span class="num" style="font-family:'Lora',serif;font-size:1rem;">30</span>`;
  if (unlocked) {
    special.addEventListener("click", openFinalLetter);
  }
  gridEl.appendChild(special);

  progressEl.textContent = `${readSet.size}/${TOTAL_TO_UNLOCK} descubiertas`;
}

/* ---------------- Abrir una razón ---------------- */
function openReason(id) {
  const r = reasons.find((x) => x.id === id);
  if (!r) return;

  readSet.add(id);
  saveRead(readSet);

  let secretHtml = "";
  if (r.secret) {
    secretHtml = `
      <button class="secret-toggle" id="secret-toggle">Un secretito</button>
      <div class="secret-content" id="secret-content">${r.secret}</div>
    `;
  }

  cardInner.innerHTML = `
    <p class="card-num">${r.id}</p>
    <p class="card-text">${r.text}</p>
    ${secretHtml}
  `;

  if (r.secret) {
    document.getElementById("secret-toggle").addEventListener("click", (e) => {
      document.getElementById("secret-content").classList.toggle("open");
    });
  }

  showOverlay();
  renderGrid(); // actualiza marcas y progreso, incluso si cierra sin ver
}

/* ---------------- Abrir la carta final ---------------- */
function openFinalLetter() {
  cardInner.innerHTML = `
    <p class="card-letter-title">${finalLetter.title}</p>
    <div class="card-letter-body">
      ${finalLetter.paragraphs.map((p) => `<p>${p}</p>`).join("")}
    </div>
  `;
  showOverlay();
}

/* ---------------- Overlay ---------------- */
function showOverlay() {
  overlay.classList.add("active");
}

function hideOverlay() {
  overlay.classList.remove("active");
}

overlay.addEventListener("click", (e) => {
  if (e.target === overlay) hideOverlay();
});

cardClose.addEventListener("click", hideOverlay);

/* ---------------- Navegación entre escenas ---------------- */
btnEmpezar.addEventListener("click", () => {
  sceneCover.classList.remove("active");
  sceneGrid.classList.add("active");
});

/* ---------------- Inicio ---------------- */
renderGrid();
