import './style.css'
import { COMPONENTS, poolForLevel, pickAlias, findComponentByAlias } from './components.js'

const HOLES_COUNT = 9
const ACTIVE_HOLES = 3
const INITIAL_LIVES = 3
const ROUNDS_PER_LEVEL = 5
const PROMOTION_THRESHOLD = 3 // 3/5 acertos para subir
const POINTS_HIT = 10
const POINTS_MISS = -5

// Curva de dificuldade: tempo visível da ronda (ms) por nível.
// Nível 1 é calmo, nível 2 mais rápido, nível 3+ é brabo.
const ROUND_TIMES = {
  1: { min: 1900, max: 2400, delay: 500 },
  2: { min: 1400, max: 1900, delay: 400 },
  3: { min: 1100, max: 1500, delay: 350 },
  4: { min: 900,  max: 1250, delay: 300 },
  5: { min: 750,  max: 1050, delay: 280 },
  6: { min: 600,  max: 900,  delay: 260 },
}
const MAX_LEVEL = 6

const state = {
  lives: INITIAL_LIVES,
  score: 0,
  best: Number(localStorage.getItem('htc_best') || 0),
  running: false,
  timer: null,
  activeHoles: new Map(), // holeIndex -> { componentId, alias, expiresAt }
  combo: 0,
  level: 1,
  roundInLevel: 0, // 0..ROUNDS_PER_LEVEL-1
  hitsInLevel: 0,
  missesInLevel: 0,
  noClickInLevel: 0,
}

const $app = document.getElementById('app')

function renderShell() {
  $app.innerHTML = `
    <header class="app-header">
      <h1><span class="emoji">🤖</span> Hit The Component</h1>
      <div class="stats">
        <div class="stat"><span class="label">Nível</span><span class="value" id="level">1</span></div>
        <div class="stat"><span class="label">Ronda</span><span class="value" id="round">0/${ROUNDS_PER_LEVEL}</span></div>
        <div class="stat"><span class="label">Vidas</span><span class="value lives" id="lives">${renderLives(state.lives)}</span></div>
        <div class="stat"><span class="label">Pontos</span><span class="value" id="score">${state.score}</span></div>
        <div class="stat"><span class="label">Recorde</span><span class="value" id="best">${state.best}</span></div>
      </div>
    </header>
    <main>
      <section class="target" id="target">
        <span class="tag">Clica no componente correspondente a:</span>
        <span class="word" id="targetWord">—</span>
        <span class="hint" id="targetHint">Carrega em <b>Começar</b> para jogar</span>
      </section>
      <section class="board" id="board">
        ${Array.from({ length: HOLES_COUNT })
          .map(
            (_, i) => `
            <div class="hole" data-hole="${i}">
              <div class="mole">
                <div class="icon"></div>
                <div class="label"></div>
              </div>
            </div>`,
          )
          .join('')}
      </section>
      <footer>
        <button class="btn" id="startBtn">Começar</button>
      </footer>
    </main>
    <div class="toast" id="toast"></div>
  `

  document.getElementById('startBtn').addEventListener('click', startGame)
  document.getElementById('board').addEventListener('click', onBoardClick)
}

function renderLives(n) {
  return n > 0 ? '♥'.repeat(n) : '<span class="empty">sem vidas</span>'
}

function setTarget(alias) {
  document.getElementById('targetWord').textContent = alias
  const t = ROUND_TIMES[state.level]
  const avg = Math.round((t.min + t.max) / 2)
  document.getElementById('targetHint').textContent = `Nível ${state.level} · tens ~${(avg / 1000).toFixed(1)}s`
}

function showToast(text, kind = 'good') {
  const t = document.getElementById('toast')
  t.textContent = text
  t.className = `toast show ${kind}`
  clearTimeout(showToast._h)
  showToast._h = setTimeout(() => {
    t.className = 'toast'
  }, 1100)
}

function flashHole(holeEl, kind) {
  holeEl.classList.remove('flash-good', 'flash-bad', 'flash-miss')
  void holeEl.offsetWidth
  holeEl.classList.add(`flash-${kind}`)
}

function pickDistinct(pool, n, excludeIds = []) {
  const filtered = pool.filter((c) => !excludeIds.includes(c.id))
  const out = []
  const used = new Set(excludeIds)
  while (out.length < n && used.size < pool.length) {
    const c = filtered[Math.floor(Math.random() * filtered.length)]
    if (!used.has(c.id)) {
      used.add(c.id)
      out.push(c)
    }
  }
  return out
}

function placeRound() {
  if (!state.running) return

  document.querySelectorAll('.hole.active').forEach((h) => {
    h.classList.remove('active')
    h.querySelector('.icon').textContent = ''
    h.querySelector('.label').textContent = ''
  })
  state.activeHoles.clear()

  const availableHoles = [...Array(HOLES_COUNT).keys()]
  const chosenHoles = []
  while (chosenHoles.length < ACTIVE_HOLES && availableHoles.length) {
    const idx = availableHoles.splice(Math.floor(Math.random() * availableHoles.length), 1)[0]
    chosenHoles.push(idx)
  }

  const pool = poolForLevel(state.level)
  const comps = pickDistinct(pool, ACTIVE_HOLES)
  // Fallback se o nível for pequeno: completa com tier 1
  while (comps.length < ACTIVE_HOLES) {
    const fillers = pickDistinct(COMPONENTS, 1, comps.map((c) => c.id))
    if (!fillers.length) break
    comps.push(fillers[0])
  }
  const targetIdx = Math.floor(Math.random() * ACTIVE_HOLES)
  const targetComponent = comps[targetIdx]
  const alias = pickAlias(targetComponent)
  setTarget(alias)

  const t = ROUND_TIMES[Math.min(state.level, MAX_LEVEL)]
  const visibleMs = t.min + Math.random() * (t.max - t.min)
  const expiresAt = Date.now() + visibleMs

  chosenHoles.forEach((holeIdx, i) => {
    const comp = comps[i]
    const holeEl = document.querySelector(`.hole[data-hole="${holeIdx}"]`)
    holeEl.classList.add('active')
    holeEl.querySelector('.icon').textContent = comp.icon
    holeEl.querySelector('.label').textContent = comp.label
    state.activeHoles.set(holeIdx, { componentId: comp.id, alias, expiresAt, holeEl })
  })

  state.timer = setTimeout(() => {
    handleMissedRound()
  }, visibleMs + 30)
}

function handleMissedRound() {
  if (!state.running) return
  state.combo = 0
  state.lives -= 1
  state.noClickInLevel += 1
  updateHud()
  if (state.lives <= 0) return endGame()
  setTimeout(advanceOrNext, ROUND_TIMES[Math.min(state.level, MAX_LEVEL)].delay)
}

function onBoardClick(ev) {
  if (!state.running) return
  const hole = ev.target.closest('.hole')
  if (!hole) return
  const idx = Number(hole.dataset.hole)
  const active = state.activeHoles.get(idx)
  if (!active) {
    showToast('Buraco vazio!', 'warn')
    flashHole(hole, 'miss')
    return
  }

  const targetWord = document.getElementById('targetWord').textContent
  const targetComponent = findComponentByAlias(targetWord)
  const clickedComponent = COMPONENTS.find((c) => c.id === active.componentId)
  const isCorrect = targetComponent && clickedComponent && targetComponent.id === clickedComponent.id

  if (isCorrect) {
    const bonus = state.combo * 2
    state.score += POINTS_HIT + bonus
    state.combo += 1
    state.hitsInLevel += 1
    flashHole(hole, 'good')
    showToast(`+${POINTS_HIT + bonus} ✓`, 'good')
  } else {
    state.score = Math.max(0, state.score + POINTS_MISS)
    state.combo = 0
    state.lives -= 1
    state.missesInLevel += 1
    flashHole(hole, 'bad')
    showToast('Errado! −5', 'bad')
  }
  updateHud()

  clearTimeout(state.timer)
  state.activeHoles.clear()
  document.querySelectorAll('.hole.active').forEach((h) => h.classList.remove('active'))

  if (state.lives <= 0) return endGame()
  setTimeout(advanceOrNext, ROUND_TIMES[Math.min(state.level, MAX_LEVEL)].delay)
}

function advanceOrNext() {
  if (!state.running) return
  state.roundInLevel += 1

  if (state.roundInLevel >= ROUNDS_PER_LEVEL) {
    finishLevel()
  } else {
    updateHud()
    placeRound()
  }
}

function finishLevel() {
  state.running = false
  clearTimeout(state.timer)
  state.activeHoles.clear()
  document.querySelectorAll('.hole.active').forEach((h) => h.classList.remove('active'))

  const promoted = state.hitsInLevel >= PROMOTION_THRESHOLD && state.level < MAX_LEVEL
  const nextLevel = promoted ? state.level + 1 : state.level

  // Sub-óptimo: se não promoveu, vidas +1 como consolação (até ao máximo)
  if (!promoted && state.hitsInLevel > 0 && state.lives < INITIAL_LIVES) {
    state.lives = Math.min(INITIAL_LIVES, state.lives + 1)
  }

  const title = promoted ? `Nível ${state.level} concluído! 🎉` : `Fim do nível ${state.level} 💪`
  const subtitle = promoted
    ? `Acertaste ${state.hitsInLevel}/${ROUNDS_PER_LEVEL} — passas ao <b>nível ${nextLevel}</b> (mais rápido).`
    : state.hitsInLevel >= PROMOTION_THRESHOLD
      ? `Já estás no nível máximo. Fica mais um bocado!`
      : `Acertaste ${state.hitsInLevel}/${ROUNDS_PER_LEVEL}. Tenta outra vez para subir.`

  // Reset contadores do nível para o próximo
  state.roundInLevel = 0
  state.hitsInLevel = 0
  state.missesInLevel = 0
  state.noClickInLevel = 0
  state.level = nextLevel
  state.running = true
  updateHud()
  showLevelSummary(title, subtitle, () => placeRound())
}

function showLevelSummary(title, subtitle, after) {
  // Pequeno banner no topo em vez de modal para manter o ritmo
  const banner = document.createElement('div')
  banner.className = 'modal-backdrop level-summary'
  banner.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true">
      <h2>${title}</h2>
      <p>${subtitle}</p>
      <div class="actions">
        <button class="btn" data-action="go">Continuar</button>
      </div>
    </div>
  `
  document.body.appendChild(banner)
  banner.querySelector('[data-action="go"]').addEventListener('click', () => {
    banner.remove()
    after()
  })
}

function updateHud() {
  document.getElementById('lives').innerHTML = renderLives(state.lives)
  document.getElementById('score').textContent = state.score
  document.getElementById('level').textContent = state.level
  document.getElementById('round').textContent = `${state.roundInLevel}/${ROUNDS_PER_LEVEL}`
  if (state.score > state.best) {
    state.best = state.score
    localStorage.setItem('htc_best', String(state.best))
    document.getElementById('best').textContent = state.best
  }
}

function startGame() {
  state.lives = INITIAL_LIVES
  state.score = 0
  state.combo = 0
  state.level = 1
  state.roundInLevel = 0
  state.hitsInLevel = 0
  state.missesInLevel = 0
  state.noClickInLevel = 0
  state.running = true
  updateHud()
  document.getElementById('startBtn').textContent = 'A jogar…'
  document.getElementById('startBtn').disabled = true
  document.getElementById('startBtn').classList.add('secondary')
  placeRound()
}

function endGame() {
  state.running = false
  clearTimeout(state.timer)
  state.activeHoles.clear()
  document.querySelectorAll('.hole.active').forEach((h) => h.classList.remove('active'))

  const btn = document.getElementById('startBtn')
  btn.textContent = 'Jogar de novo'
  btn.disabled = false
  btn.classList.remove('secondary')

  const modal = document.createElement('div')
  modal.className = 'modal-backdrop'
  modal.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true">
      <h2>Game Over 🤖</h2>
      <div class="final-score">${state.score} pts</div>
      <p>Chegaste ao <b>nível ${state.level}</b> · Recorde: <b>${state.best}</b></p>
      <div class="help">
        <div>✅ <b>Acertaste</b> → +10 (combo soma bónus)</div>
        <div>❌ <b>Erraste</b> → −5 pontos e 1 vida</div>
        <div>⏱️ <b>Não clicaste</b> a tempo → perdes 1 vida</div>
        <div>📈 <b>3/5 acertos</b> → sobes de nível (mais rápido)</div>
      </div>
      <div class="actions">
        <button class="btn" data-action="again">Jogar de novo</button>
      </div>
    </div>
  `
  document.body.appendChild(modal)
  modal.querySelector('[data-action="again"]').addEventListener('click', () => {
    modal.remove()
    startGame()
  })
}

renderShell()
updateHud()
