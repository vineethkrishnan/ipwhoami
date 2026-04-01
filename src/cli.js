import { VERSION, DEFAULT_PROVIDER, PROVIDER_NAMES } from './config.js';
import { bold, dim, green, red } from './colors.js';
import { validateIP, getPublicIP } from './ip.js';
import { getProvider, getAllProviders } from './providers/index.js';
import { formatResult, formatRaw, formatCompareHeader } from './formatter.js';

function printUsage() {
  console.log(`${bold('ipwhoami')} - IP geolocation lookup from your terminal

${bold('USAGE')}
  ipwhoami [options] [ip]

${bold('ARGUMENTS')}
  ip                    IP address to look up (defaults to your public IP)

${bold('OPTIONS')}
  -p, --provider NAME   Use a specific provider: ${PROVIDER_NAMES.join(', ')} (default: ${DEFAULT_PROVIDER})
  -c, --compare         Compare results from all providers
  -r, --raw             Output raw JSON (no formatting)
  -h, --help            Show this help message
  -v, --version         Show version

${bold('EXAMPLES')}
  ipwhoami                          Look up your own public IP
  ipwhoami 8.8.8.8                  Look up a specific IP
  ipwhoami -c                       Compare your IP across all providers
  ipwhoami -c 1.1.1.1              Compare a specific IP across all providers
  ipwhoami -p ipapi 8.8.8.8        Use a specific provider
  ipwhoami -r 8.8.8.8              Raw JSON output (pipe-friendly)`);
}

function parseArgs(argv) {
  const opts = {
    ip: null,
    provider: DEFAULT_PROVIDER,
    compare: false,
    raw: false,
    help: false,
    version: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    switch (arg) {
      case '-h':
      case '--help':
        opts.help = true;
        break;
      case '-v':
      case '--version':
        opts.version = true;
        break;
      case '-c':
      case '--compare':
        opts.compare = true;
        break;
      case '-r':
      case '--raw':
        opts.raw = true;
        break;
      case '-p':
      case '--provider':
        i++;
        opts.provider = argv[i];
        if (!opts.provider) {
          die('--provider requires a value.');
        }
        break;
      default:
        if (arg.startsWith('-')) {
          die(`unknown option: ${arg}. Use --help for usage.`);
        }
        opts.ip = arg;
    }
  }

  return opts;
}

function die(message) {
  console.error(`${red('error:')} ${message}`);
  process.exit(1);
}

async function lookup(ip, providerName, raw) {
  const provider = getProvider(providerName);
  const result = await provider.lookup(ip);

  if (raw) {
    console.log(formatRaw(result));
  } else {
    console.log(formatResult(providerName, result));
  }
}

async function compare(ip, raw) {
  console.log(formatCompareHeader(ip));
  console.log();

  for (const { name, provider } of getAllProviders()) {
    const result = await provider.lookup(ip);
    if (raw) {
      console.log(`// ${name}`);
      console.log(formatRaw(result));
    } else {
      console.log(formatResult(name, result));
    }
    console.log();
  }

  console.log(dim('Done.'));
}

export async function run(argv) {
  const opts = parseArgs(argv);

  if (opts.help) {
    printUsage();
    return;
  }

  if (opts.version) {
    console.log(`ipwhoami ${VERSION}`);
    return;
  }

  let ip = opts.ip;

  try {
    if (!ip) {
      console.log(dim('Fetching your public IP...'));
      ip = await getPublicIP();
      console.log(`${bold('Your IP:')} ${green(ip)}\n`);
    } else {
      validateIP(ip);
    }

    if (opts.compare) {
      await compare(ip, opts.raw);
    } else {
      await lookup(ip, opts.provider, opts.raw);
    }
  } catch (err) {
    die(err.message);
  }
}
