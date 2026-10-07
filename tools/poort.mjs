// Poort vóór elke push: draait alle controles na elkaar en faalt als er één faalt.
// Gebruik (vanuit pixelperfect-photo-painter): node <pad>/tools/poort.mjs [--snel]   →  pas pushen bij exitcode 0.
// Les 7 okt 2026: een pipe naar tail nam de foutcode weg en er werd gepusht met 4 rode tests. Daarom één poort, zonder pipes.
import { spawnSync } from 'node:child_process'; import path from 'node:path'; import os from 'node:os';
const T = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'));
const snel = process.argv.includes('--snel');
const stappen = [
  ['bouwen', 'node', [path.join(T, '..', 'build.cjs')]],
  ['copy-trouw', 'node', [path.join(T, 'check-copy-trouw.cjs')]],
  ['keuring pagina\'s', 'node', [path.join(T, 'keur.mjs'), path.join(os.tmpdir(), 'inzicht-poort-shots'), '1440,1024,390']],
  ['gedrag', 'node', [path.join(T, 'gedrag.mjs')]],
  ['menucontrast', 'node', [path.join(T, 'nav-contrast.mjs')]],
  ...(snel ? [] : [['prestaties', 'node', [path.join(T, 'prestaties.mjs')]]]),
  // positieve controle: POORT_TEST_FOUT=1 voegt een stap toe die altijd faalt, de poort moet dan dichtgaan
  ...(process.env.POORT_TEST_FOUT ? [['test-fout', 'node', ['-e', 'process.exit(1)']]] : []),
];
let rood = 0;
for (const [naam, cmd, args] of stappen) {
  const r = spawnSync(cmd, args, { cwd: 'C:/Users/Mohammed/pixelperfect-photo-painter', encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  const uit = (r.stdout || '') + (r.stderr || '');
  const ok = r.status === 0;
  if (!ok) rood++;
  const regels = uit.trim().split('\n');
  const laatste = regels.filter((l) => /GROEN|ROOD|PASS \/|gebouwd/.test(l)).slice(-1)[0] || regels.slice(-1)[0];
  console.log(`${ok ? 'GROEN' : 'ROOD '}  ${naam.padEnd(18)} ${laatste || ''}`);
  if (!ok) console.log(regels.filter((l) => /FAIL|FOUT|ROOD|Error| - /.test(l)).slice(0, 15).map((l) => '        ' + l).join('\n'));
}
console.log(rood ? `\nPOORT DICHT: ${rood} controle(s) rood, niet pushen.` : '\nPOORT OPEN: alles groen.');
process.exit(rood ? 1 : 0);
