import './style.css'
import { COMPONENTS, pickAlias, findComponentByAlias } from './components.js'

const HOLES_COUNT = 9
const ACTIVE_HOLES = 3
const INITIAL_LIVES = 3
const SHOW_MIN_MS = 1100
const SHOW_MAX_MS = 1900
const ROUND_DELAY_MS = 350

const state = {
  lives: INITIAL_LIVES,
  score: 0,
  best: Number(localStorage.getItem('htc_best') || 0),
  running: false,
  timer: null,
  activeHoles: new Map(), // holeIndex -> { componentId, alias, expiresAt }
  combo: 0,
}

const $app = document.getElementById('app')

function renderShell() {
  $app.innerHTML = `
    <header class="app-header">
      <h1><span class="emoji">🤖</span> Hit The Component</h1>
      <div class="stats">
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
  document.getElementById('targetHint').textContent = 'Sê rápido — tens poucos segundos!'
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

function pickDistinct(n, excludeIds = []) {
  const pool = COMPONENTS.filter((c) => !excludeIds.includes(c.id))
  const out = []
  const used = new Set(excludeIds)
  while (out.length < n && used.size < COMPONENTS.length) {
    const c = pool[Math.floor(Math.random() * pool.length)]
    if (!used.has(c.id)) {
      used.add(c.id)
      out.push(c)
    }
  }
  return out
}

function placeRound() {
  if (!state.running) return

  // Limpar buracos activos
  document.querySelectorAll('.hole.active').forEach((h) => {
    h.classList.remove('active')
    h.querySelector('.icon').textContent = ''
    h.querySelector('.label').textContent = ''
  })
  state.activeHoles.clear()

  // Escolher 3 buracos diferentes
  const availableHoles = [...Array(HOLES_COUNT).keys()]
  const chosenHoles = []
  while (chosenHoles.length < ACTIVE_HOLES && availableHoles.length) {
    const idx = availableHoles.splice(Math.floor(Math.random() * availableHoles.length), 1)[0]
    chosenHoles.push(idx)
  }

  // Escolher 3 componentes distintos
  const comps = pickDistinct(ACTIVE_HOLES)
  // Um deles será o alvo
  const targetIdx = Math.floor(Math.random() * ACTIVE_HOLES)
  const targetComponent = comps[targetIdx]
  const alias = pickAlias(targetComponent)
  setTarget(alias)

  // Tempo visível: a ronda fica activa entre SHOW_MIN_MS e SHOW_MAX_MS
  const visibleMs = SHOW_MIN_MS + Math.random() * (SHOW_MAX_MS - SHOW_MIN_MS)
  const expiresAt = Date.now() + visibleMs

  chosenHoles.forEach((holeIdx, i) => {
    const comp = comps[i]
    const holeEl = document.querySelector(`.hole[data-hole="${holeIdx}"]`)
    holeEl.classList.add('active')
    holeEl.querySelector('.icon').textContent = comp.icon
    holeEl.querySelector('.label').textContent = comp.label
    state.activeHoles.set(holeIdx, { componentId: comp.id, alias, expiresAt, holeEl })
  })

  // Se o tempo expirar e o utilizador não clicou, é uma falha silenciosa (sem perder vida extra,
  // porque o alvo mudou — a regra "não clicar perde vida" é por ronda: se não há clique válido
  // em nenhuma ronda, conta-se como falta). Tratamos a falta aqui também.
  state.timer = setTimeout(() => {
    handleMissedRound()
  }, visibleMs + 30)
}

function handleMissedRound() {
  if (!state.running) return
  // Se o tempo passou e ninguém clicou, é uma vida perdida (silencioso, sem flash)
  state.combo = 0
  state.lives -= 1
  updateHud()
  if (state.lives <= 0) return endGame()
  setTimeout(placeRound, ROUND_DELAY_MS)
}

function onBoardClick(ev) {
  if (!state.running) return
  const hole = ev.target.closest('.hole')
  if (!hole) return
  const idx = Number(hole.dataset.hole)
  const active = state.activeHoles.get(idx)
  if (!active) {
    // clique em buraco vazio: pequena penalização, sem perder vida
    showToast('Buraco vazio!', 'warn')
    flashHole(hole, 'miss')
    return
  }

  const targetWord = document.getElementById('targetWord').textContent
  const targetComponent = findComponentByAlias(targetWord)
  const clickedComponent = COMPONENTS.find((c) => c.id === active.componentId)
  const isCorrect = targetComponent && clickedComponent && targetComponent.id === clickedComponent.id

  if (isCorrect) {
    state.score += 10 + state.combo * 2
    state.combo += 1
    flashHole(hole, 'good')
    showToast(`+${10 + (state.combo - 1) * 2} ✓`, 'good')
  } else {
    state.score = Math.max(0, state.score - 5)
    state.combo = 0
    state.lives -= 1
    flashHole(hole, 'bad')
    showToast('Errado! −5', 'bad')
  }
  updateHud()

  // Limpar timer e preparar próxima ronda
  clearTimeout(state.timer)
  state.activeHoles.clear()
  document.querySelectorAll('.hole.active').forEach((h) => h.classList.remove('active'))

  if (state.lives <= 0) return endGame()
  setTimeout(placeRound, ROUND_DELAY_MS)
}

function updateHud() {
  document.getElementById('lives').innerHTML = renderLives(state.lives)
  document.getElementById('score').textContent = state.score
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
      <p>Recorde: <b>${state.best}</b></p>
      <div class="help">
        <div>✅ <b>Acertaste</b> no alvo → +10 (combo soma bónus)</div>
        <div>❌ <b>Erraste</b> no alvo → −5 pontos e 1 vida</div>
        <div>⏱️ <b>Não clicaste</b> a tempo → perdes 1 vida</div>
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
