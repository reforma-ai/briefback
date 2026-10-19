import { cancel, isCancel, outro, select } from '@clack/prompts';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { styleText } from 'node:util';

import {
  AGENTS_POINTER,
  DOC_COMPONENTS,
  ensureAgentsPointer,
  generatedWorkflow,
  isGeneratedWorkflow,
  readSetupConfig,
  type SetupComponent,
  writeAtomically,
  writeSetupConfig,
} from './project';
import {
  BRIEFBACK_SKILLS,
  type RunSkills,
  runSkills,
  SKILLS_SOURCE,
} from './skills';

export {
  AGENTS_POINTER,
  GENERATED_MARKER,
  type SetupComponent,
} from './project';
export { BRIEFBACK_SKILLS } from './skills';

interface Writer {
  write(value: string): unknown;
}

interface CliDependencies {
  cwd?: string;
  stdout?: Writer;
  stderr?: Writer;
  promptDocs?: () => Promise<boolean | null>;
  runSkills?: RunSkills;
  workflow?: string;
}

function finish(message: string, output: Writer) {
  outro(styleText('green', message), {
    output: output as NodeJS.WriteStream,
  });
}

interface PackageJson {
  version: string;
}

type Command = 'init' | 'update';

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const packageJson = JSON.parse(
  readFileSync(resolve(packageRoot, 'package.json'), 'utf8'),
) as PackageJson;

function parseOptions(args: string[], command: Command): string[] {
  const forwarded: string[] = [];

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];

    if (argument === '--agent' || argument === '-a') {
      if (command !== 'init') {
        throw new Error(`${argument} is only supported by init.`);
      }

      const agent = args[index + 1];
      if (!agent || agent.startsWith('-')) {
        throw new Error(`${argument} requires an agent name.`);
      }

      forwarded.push(argument, agent);
      index += 1;
      continue;
    }

    if (argument === '--global' || argument === '-g') {
      forwarded.push(argument);
      continue;
    }

    if (argument === '--project' || argument === '-p') {
      if (command !== 'update') {
        throw new Error(`${argument} is only supported by update.`);
      }

      forwarded.push(argument);
      continue;
    }

    if (argument === '--yes' || argument === '-y') {
      forwarded.push(argument);
      continue;
    }

    throw new Error(`Unknown option: ${argument}`);
  }

  return forwarded;
}

function help(): string {
  return `Briefback ${packageJson.version}

Usage:
  briefback init [--agent <name>] [--global] [--yes]
  briefback update [--global | --project] [--yes]
  briefback --version

Commands:
  init      Install the Briefback skill, then optionally the docs
  update    Update Briefback, installing it first when needed

The skills CLI handles agent, scope, and installation choices.
`;
}

async function promptDocs(): Promise<boolean | null> {
  const selected = await select({
    message: 'Set up Briefback docs?',
    options: [
      {
        value: true,
        label: 'Yes',
        hint: 'BRIEFBACK.md + pointer to it in AGENTS.md',
      },
      {
        value: false,
        label: 'No',
        hint: 'skill only',
      },
    ],
    initialValue: true,
  });

  if (isCancel(selected)) {
    cancel('Briefback setup cancelled.');
    return null;
  }

  return selected;
}

export async function runCli(
  args: string[],
  {
    cwd = process.cwd(),
    stdout = process.stdout,
    stderr = process.stderr,
    promptDocs: selectDocs = promptDocs,
    runSkills: executeSkills = runSkills,
    workflow = readFileSync(resolve(packageRoot, 'BRIEFBACK.md'), 'utf8'),
  }: CliDependencies = {},
): Promise<number> {
  const [command, ...optionArgs] = args;

  if (!command || command === '--help' || command === '-h') {
    stdout.write(help());
    return 0;
  }

  if (command === '--version' || command === '-v') {
    stdout.write(`${packageJson.version}\n`);
    return 0;
  }

  if (command !== 'init' && command !== 'update') {
    stderr.write(`Unknown command: ${command}\n\n${help()}`);
    return 1;
  }

  try {
    const forwarded = parseOptions(optionArgs, command);
    const workflowPath = resolve(cwd, 'BRIEFBACK.md');
    const config = readSetupConfig(cwd);
    const legacyInstall = !config && isGeneratedWorkflow(workflowPath);
    const installing = command === 'init' || (!config && !legacyInstall);
    const assumeDefaults =
      forwarded.includes('--yes') || forwarded.includes('-y');

    let components: SetupComponent[];

    if (installing) {
      const installOptions = forwarded.filter(
        (option) => option !== '--project' && option !== '-p',
      );
      const status = executeSkills([
        'add',
        SKILLS_SOURCE,
        '--skill',
        ...BRIEFBACK_SKILLS,
        ...installOptions,
      ]);

      if (status !== 0) {
        stderr.write(
          `Briefback skill install failed with exit code ${status}.\n`,
        );
        return status;
      }

      const wantDocs = assumeDefaults ? true : await selectDocs();

      if (wantDocs === null) {
        writeSetupConfig(cwd, ['skills']);
        finish('Briefback skill installed.', stdout);
        return 0;
      }

      components = wantDocs
        ? ['skills', ...DOC_COMPONENTS]
        : ['skills'];
    } else {
      components = config?.components ?? ['skills', 'workflow'];
    }

    if (!installing && components.includes('skills')) {
      const status = executeSkills([
        'update',
        ...BRIEFBACK_SKILLS,
        ...forwarded,
      ]);

      if (status !== 0) {
        stderr.write(
          `Briefback skill update failed with exit code ${status}.\n`,
        );
        return status;
      }
    }

    if (components.includes('workflow')) {
      writeAtomically(workflowPath, generatedWorkflow(workflow));
    }

    if (components.includes('agents')) {
      ensureAgentsPointer(cwd);
    }

    writeSetupConfig(cwd, components);

    finish(
      installing ? 'Briefback initialized.' : 'Briefback updated.',
      stdout,
    );

    return 0;
  } catch (error) {
    stderr.write(
      `${error instanceof Error ? error.message : String(error)}\n`,
    );
    return 1;
  }
}
