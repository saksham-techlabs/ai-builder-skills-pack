export interface Options {
  command: string; ids: string[]; preset?: string; target: string;
  force: boolean; all: boolean;
}

// `npm run cli` executes from the package root; INIT_CWD holds the directory the user ran npm from.
export function defaultTarget(env: NodeJS.ProcessEnv = process.env): string {
  return env.npm_lifecycle_event === 'cli' && env.INIT_CWD ? env.INIT_CWD : process.cwd();
}

export function parseArgs(argv: string[]): Options {
  if (!argv.length || argv[0] === '--help' || argv[0] === '-h') return { command: 'help', ids: [], target: defaultTarget(), force: false, all: false };
  const command = argv[0]!;
  if (!['help', 'list', 'init', 'install', 'installed', 'remove'].includes(command)) throw new Error(`Unknown command: ${command}. Run --help.`);
  if (argv.includes('--help') || argv.includes('-h')) return { command: 'help', ids: [], target: defaultTarget(), force: false, all: false };
  const options: Options = { command, ids: [], target: defaultTarget(), force: false, all: false };
  const seen = new Set<string>();
  for (let i = 1; i < argv.length; i++) {
    const token = argv[i]!;
    if (!token.startsWith('-')) { options.ids.push(token); continue; }
    if (seen.has(token)) throw new Error(`Repeated option: ${token}`);
    seen.add(token);
    if (token === '--force') options.force = true;
    else if (token === '--all') options.all = true;
    else if (token === '--preset' || token === '--target') {
      const value = argv[++i];
      if (!value || value.startsWith('-')) throw new Error(`Missing value for ${token}`);
      if (token === '--preset') options.preset = value;
      else options.target = value;
    } else throw new Error(`Unknown option: ${token}`);
  }
  if (['help', 'list'].includes(command) && argv.length > 1) throw new Error(`${command} does not accept options or skill IDs.`);
  if (command === 'installed' && (options.ids.length || options.all || options.force)) throw new Error('installed accepts only --preset and --target.');
  if (command === 'remove' && options.all) throw new Error('remove requires explicit skill IDs; --all is not supported.');
  if (options.all && options.ids.length) throw new Error('Choose skill IDs or --all, not both.');
  options.ids = [...new Set(options.ids)];
  return options;
}
