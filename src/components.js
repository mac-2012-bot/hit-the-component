// Catálogo de componentes técnicos com ícone e aliases (palavras/expressões alvo)
export const COMPONENTS = [
  // Eletrónica / hardware
  { id: 'resistor', icon: '🟫', label: 'Resistor', aliases: ['Resistência', 'Resistor', 'Resistência fixa'] },
  { id: 'capacitor', icon: '🟡', label: 'Condensador', aliases: ['Condensador', 'Capacitor', 'Capacitância'] },
  { id: 'inductor', icon: '🟧', label: 'Bobina', aliases: ['Bobina', 'Indutor', 'Indutância'] },
  { id: 'diode', icon: '▶️', label: 'Díodo', aliases: ['Díodo', 'Diodo', 'Retificador'] },
  { id: 'led', icon: '💡', label: 'LED', aliases: ['LED', 'Light Emitting Diode', 'Díodo emissor de luz'] },
  { id: 'transistor', icon: '🔻', label: 'Transístor', aliases: ['Transístor', 'Transistor', 'BJT', 'MOSFET'] },
  { id: 'battery', icon: '🔋', label: 'Bateria', aliases: ['Bateria', 'Pilha', 'Acumulador'] },
  { id: 'ic', icon: '🧠', label: 'Circuito Integrado', aliases: ['CI', 'Circuito Integrado', 'Chip', 'Microchip'] },
  { id: 'microcontroller', icon: '🤖', label: 'Microcontrolador', aliases: ['Microcontrolador', 'MCU', 'Microcontrolador Arduino'] },
  { id: 'sensor', icon: '📡', label: 'Sensor', aliases: ['Sensor', 'Transdutor'] },
  { id: 'buzzer', icon: '🔔', label: 'Buzzers', aliases: ['Buzzer', 'Buzzers', 'Campainha piezoelétrica'] },
  { id: 'antenna', icon: '📶', label: 'Antena', aliases: ['Antena', 'Antena Wi-Fi', 'Antena RF'] },

  // Computação / web
  { id: 'cpu', icon: '🧮', label: 'CPU', aliases: ['CPU', 'Processador', 'Unidade Central de Processamento'] },
  { id: 'gpu', icon: '🎮', label: 'GPU', aliases: ['GPU', 'Placa gráfica', 'Processador gráfico'] },
  { id: 'ram', icon: '🧠', label: 'RAM', aliases: ['RAM', 'Memória RAM', 'Memória de acesso aleatório'] },
  { id: 'rom', icon: '💾', label: 'ROM', aliases: ['ROM', 'Memória ROM', 'Firmware'] },
  { id: 'ssd', icon: '🗄️', label: 'SSD', aliases: ['SSD', 'Disco SSD', 'Solid State Drive'] },
  { id: 'hdd', icon: '💽', label: 'HDD', aliases: ['HDD', 'Disco rígido', 'Hard Disk Drive'] },
  { id: 'motherboard', icon: '🧩', label: 'Motherboard', aliases: ['Motherboard', 'Placa-mãe', 'Mainboard'] },
  { id: 'psu', icon: '🔌', label: 'Fonte de Alimentação', aliases: ['Fonte de alimentação', 'PSU', 'Power Supply'] },
  { id: 'cooler', icon: '❄️', label: 'Dissipador', aliases: ['Dissipador', 'Cooler', 'Ventoinha'] },
  { id: 'router', icon: '📡', label: 'Router', aliases: ['Router', 'Roteador', 'Roteador de rede'] },

  // Web / dev
  { id: 'react', icon: '⚛️', label: 'React', aliases: ['React', 'React.js', 'ReactJS'] },
  { id: 'vite', icon: '⚡', label: 'Vite', aliases: ['Vite', 'Vite.js', 'Ferramenta Vite'] },
  { id: 'node', icon: '🟢', label: 'Node.js', aliases: ['Node.js', 'Node', 'NodeJS'] },
  { id: 'docker', icon: '🐳', label: 'Docker', aliases: ['Docker', 'Contentor', 'Container Docker'] },
  { id: 'linux', icon: '🐧', label: 'Linux', aliases: ['Linux', 'Kernel Linux', 'Sistema Linux'] },
  { id: 'git', icon: '🔧', label: 'Git', aliases: ['Git', 'Sistema de controlo de versão', 'Controlo de versão'] },
  { id: 'api', icon: '🔗', label: 'API', aliases: ['API', 'Interface de Programação', 'Endpoint'] },
  { id: 'database', icon: '🗃️', label: 'Base de Dados', aliases: ['Base de Dados', 'Database', 'DB', 'SQL'] },
  { id: 'json', icon: '📦', label: 'JSON', aliases: ['JSON', 'JavaScript Object Notation'] },
  { id: 'html', icon: '🌐', label: 'HTML', aliases: ['HTML', 'HyperText Markup Language'] },
  { id: 'css', icon: '🎨', label: 'CSS', aliases: ['CSS', 'Cascading Style Sheets', 'Folhas de estilo'] },
  { id: 'js', icon: '🟨', label: 'JavaScript', aliases: ['JavaScript', 'JS', 'ECMAScript'] },
  { id: 'ts', icon: '🟦', label: 'TypeScript', aliases: ['TypeScript', 'TS'] },
  { id: 'tailwind', icon: '🌬️', label: 'Tailwind', aliases: ['Tailwind', 'Tailwind CSS', 'TailwindCSS'] },
  { id: 'vite-plugin', icon: '🧪', label: 'Plugin Vite', aliases: ['Plugin Vite', 'Vite plugin', 'Plugin do Vite'] },
  { id: 'terminal', icon: '🖥️', label: 'Terminal', aliases: ['Terminal', 'Linha de comandos', 'CLI', 'Shell'] },

  // Redes
  { id: 'firewall', icon: '🛡️', label: 'Firewall', aliases: ['Firewall', 'Firewall de rede', 'Parede de fogo'] },
  { id: 'dns', icon: '📨', label: 'DNS', aliases: ['DNS', 'Domain Name System', 'Servidor DNS'] },
  { id: 'tcp', icon: '🔌', label: 'TCP', aliases: ['TCP', 'Transmission Control Protocol', 'Protocolo TCP'] },
  { id: 'http', icon: '📡', label: 'HTTP', aliases: ['HTTP', 'HyperText Transfer Protocol', 'Protocolo HTTP'] },
  { id: 'https', icon: '🔒', label: 'HTTPS', aliases: ['HTTPS', 'HTTP Seguro', 'HTTP over TLS'] },
]

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
    .trim()
  const target = norm(alias)
  for (const c of COMPONENTS) {
    if (c.aliases.some((a) => norm(a) === target)) return c
  }
  // fallback: contains
  for (const c of COMPONENTS) {
    if (c.aliases.some((a) => norm(a).includes(target) || target.includes(norm(a)))) return c
  }
  return null
}
