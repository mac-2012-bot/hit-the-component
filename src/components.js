// Catálogo de componentes técnicos com ícone e aliases (palavras/expressões alvo)
// Cada componente tem um `tier` (1=fácil, 2=médio, 3=difícil).
// Nível 1 usa só tier 1, nível 2 usa tiers 1+2, nível 3+ usa todos.
export const COMPONENTS = [
  // Tier 1 — conceitos do dia-a-dia
  { id: 'resistor', tier: 1, icon: '🟫', label: 'Resistor', aliases: ['Resistência', 'Resistor'] },
  { id: 'capacitor', tier: 1, icon: '🟡', label: 'Condensador', aliases: ['Condensador', 'Capacitor'] },
  { id: 'battery', tier: 1, icon: '🔋', label: 'Bateria', aliases: ['Bateria', 'Pilha'] },
  { id: 'led', tier: 1, icon: '💡', label: 'LED', aliases: ['LED', 'Light Emitting Diode'] },
  { id: 'cpu', tier: 1, icon: '🧮', label: 'CPU', aliases: ['CPU', 'Processador'] },
  { id: 'ram', tier: 1, icon: '🧠', label: 'RAM', aliases: ['RAM', 'Memória RAM'] },
  { id: 'ssd', tier: 1, icon: '🗄️', label: 'SSD', aliases: ['SSD', 'Disco SSD'] },
  { id: 'router', tier: 1, icon: '📡', label: 'Router', aliases: ['Router', 'Roteador'] },
  { id: 'sensor', tier: 1, icon: '📡', label: 'Sensor', aliases: ['Sensor', 'Transdutor'] },
  { id: 'react', tier: 1, icon: '⚛️', label: 'React', aliases: ['React', 'ReactJS'] },
  { id: 'html', tier: 1, icon: '🌐', label: 'HTML', aliases: ['HTML'] },
  { id: 'css', tier: 1, icon: '🎨', label: 'CSS', aliases: ['CSS'] },
  { id: 'js', tier: 1, icon: '🟨', label: 'JavaScript', aliases: ['JavaScript', 'JS'] },
  { id: 'terminal', tier: 1, icon: '🖥️', label: 'Terminal', aliases: ['Terminal', 'CLI'] },

  // Tier 2 — termos técnicos
  { id: 'inductor', tier: 2, icon: '🟧', label: 'Bobina', aliases: ['Bobina', 'Indutor'] },
  { id: 'diode', tier: 2, icon: '▶️', label: 'Díodo', aliases: ['Díodo', 'Diodo'] },
  { id: 'transistor', tier: 2, icon: '🔻', label: 'Transístor', aliases: ['Transístor', 'Transistor', 'MOSFET'] },
  { id: 'ic', tier: 2, icon: '🧠', label: 'Circuito Integrado', aliases: ['CI', 'Circuito Integrado', 'Chip'] },
  { id: 'microcontroller', tier: 2, icon: '🤖', label: 'Microcontrolador', aliases: ['Microcontrolador', 'MCU'] },
  { id: 'buzzer', tier: 2, icon: '🔔', label: 'Buzzer', aliases: ['Buzzer', 'Campainha piezoelétrica'] },
  { id: 'antenna', tier: 2, icon: '📶', label: 'Antena', aliases: ['Antena', 'Antena Wi-Fi'] },
  { id: 'gpu', tier: 2, icon: '🎮', label: 'GPU', aliases: ['GPU', 'Placa gráfica'] },
  { id: 'rom', tier: 2, icon: '💾', label: 'ROM', aliases: ['ROM', 'Memória ROM', 'Firmware'] },
  { id: 'hdd', tier: 2, icon: '💽', label: 'HDD', aliases: ['HDD', 'Disco rígido'] },
  { id: 'motherboard', tier: 2, icon: '🧩', label: 'Motherboard', aliases: ['Motherboard', 'Placa-mãe', 'Mainboard'] },
  { id: 'psu', tier: 2, icon: '🔌', label: 'Fonte de Alimentação', aliases: ['Fonte de alimentação', 'PSU'] },
  { id: 'cooler', tier: 2, icon: '❄️', label: 'Dissipador', aliases: ['Dissipador', 'Cooler'] },
  { id: 'vite', tier: 2, icon: '⚡', label: 'Vite', aliases: ['Vite', 'Vite.js'] },
  { id: 'node', tier: 2, icon: '🟢', label: 'Node.js', aliases: ['Node.js', 'Node', 'NodeJS'] },
  { id: 'docker', tier: 2, icon: '🐳', label: 'Docker', aliases: ['Docker', 'Contentor', 'Container'] },
  { id: 'git', tier: 2, icon: '🔧', label: 'Git', aliases: ['Git', 'Controlo de versão'] },
  { id: 'api', tier: 2, icon: '🔗', label: 'API', aliases: ['API', 'Endpoint'] },
  { id: 'database', tier: 2, icon: '🗃️', label: 'Base de Dados', aliases: ['Base de Dados', 'Database', 'SQL'] },
  { id: 'json', tier: 2, icon: '📦', label: 'JSON', aliases: ['JSON', 'JavaScript Object Notation'] },
  { id: 'ts', tier: 2, icon: '🟦', label: 'TypeScript', aliases: ['TypeScript', 'TS'] },
  { id: 'tailwind', tier: 2, icon: '🌬️', label: 'Tailwind', aliases: ['Tailwind', 'Tailwind CSS'] },
  { id: 'firewall', tier: 2, icon: '🛡️', label: 'Firewall', aliases: ['Firewall', 'Parede de fogo'] },

  // Tier 3 — jargão
  { id: 'dns', tier: 3, icon: '📨', label: 'DNS', aliases: ['DNS', 'Domain Name System'] },
  { id: 'tcp', tier: 3, icon: '🔌', label: 'TCP', aliases: ['TCP', 'Transmission Control Protocol'] },
  { id: 'http', tier: 3, icon: '📡', label: 'HTTP', aliases: ['HTTP', 'HyperText Transfer Protocol'] },
  { id: 'https', tier: 3, icon: '🔒', label: 'HTTPS', aliases: ['HTTPS', 'HTTP over TLS'] },
  { id: 'vite-plugin', tier: 3, icon: '🧪', label: 'Plugin Vite', aliases: ['Plugin Vite', 'Vite plugin'] },
]

// Devolve o pool de componentes permitido para um dado nível
export function poolForLevel(level) {
  const maxTier = level >= 3 ? 3 : level
  return COMPONENTS.filter((c) => c.tier <= maxTier)
}

// Devolve um alias aleatório de um componente
export function pickAlias(component) {
  return component.aliases[Math.floor(Math.random() * component.aliases.length)]
}

// Devolve o componente a partir de um alias (procura tolerante, case-insensitive, sem acentos)
export function findComponentByAlias(alias) {
  const norm = (s) => s
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[.!?,;]+$/g, '') // tira pontuação à direita
    .trim()
  const target = norm(alias)
  if (!target) return null
  for (const c of COMPONENTS) {
    if (c.aliases.some((a) => norm(a) === target)) return c
  }
  // fallback: contains
  for (const c of COMPONENTS) {
    if (c.aliases.some((a) => norm(a).includes(target) || target.includes(norm(a)))) return c
  }
  return null
}
