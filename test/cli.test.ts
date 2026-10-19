import { expect, test } from 'bun:test';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  BRIEFBACK_SKILLS,
  AGENTS_POINTER,
  GENERATED_MARKER,
  runCli,
} from '../src/cli';

function project() {
  const cwd = mkdtempSync(join(tmpdir(), 'briefback-'));
  let stdout = '';
  let stderr = '';
  const calls: string[][] = [];

  return {
    cwd,
    calls,
    stdout: { write: (value: string) => (stdout += value) },
    stderr: { write: (value: string) => (stderr += value) },
    output: () => ({ stdout, stderr }),
    cleanup: () => rmSync(cwd, { recursive: true, force: true }),
  };
}

test('init --yes installs the skill then docs without prompting', async () => {
  const context = project();

  try {
    const status = await runCli(['init', '--yes'], {
      ...context,
      workflow: '# Workflow\n',
      promptDocs: () => {
        throw new Error('prompt should not run');
      },
      runSkills: (args) => {
        context.calls.push(args);
        return 0;
      },
    });

    expect(status).toBe(0);
    expect(context.calls).toEqual([
      ['add', 'reforma-ai/briefback', '--skill', 'briefback', '--yes'],
    ]);
    expect(readFileSync(join(context.cwd, 'BRIEFBACK.md'), 'utf8')).toBe(
      `${GENERATED_MARKER}\n\n# Workflow\n`,
    );
    expect(context.output().stdout).toContain('Briefback initialized');
    expect(readFileSync(join(context.cwd, 'AGENTS.md'), 'utf8')).toBe(
      `${AGENTS_POINTER}\n`,
    );
    expect(
      JSON.parse(
        readFileSync(join(context.cwd, '.briefback/config.json'), 'utf8'),
      ),
    ).toEqual({
      version: 1,
      components: ['skills', 'workflow', 'agents'],
    });
    expect(context.output().stderr).toBe('');
  } finally {
    context.cleanup();
  }
});

test('init is idempotent and forwards install options', async () => {
  const context = project();
  writeFileSync(join(context.cwd, '.gitignore'), 'dist/\n');
  writeFileSync(
    join(context.cwd, 'BRIEFBACK.md'),
    `${GENERATED_MARKER}\n\nold\n`,
  );

  try {
    const status = await runCli(
      ['init', '--agent', 'cursor', '--global', '--yes'],
      {
        ...context,
        workflow: 'new\n',
        runSkills: (args) => {
          context.calls.push(args);
          return 0;
        },
      },
    );

    expect(status).toBe(0);
    expect(context.calls).toEqual([
      [
        'add',
        'reforma-ai/briefback',
        '--skill',
        'briefback',
        '--agent',
        'cursor',
        '--global',
        '--yes',
      ],
    ]);
    expect(readFileSync(join(context.cwd, 'BRIEFBACK.md'), 'utf8')).toBe(
      `${GENERATED_MARKER}\n\nnew\n`,
    );
  } finally {
    context.cleanup();
  }
});

test('init replaces an existing BRIEFBACK.md', async () => {
  const context = project();
  writeFileSync(join(context.cwd, 'BRIEFBACK.md'), '# My workflow\n');

  try {
    const status = await runCli(['init', '--yes'], {
      ...context,
      workflow: '# Briefback\n',
      promptDocs: () => {
        throw new Error('prompt should not run');
      },
      runSkills: (args) => {
        context.calls.push(args);
        return 0;
      },
    });

    expect(status).toBe(0);
    expect(context.calls).toEqual([
      ['add', 'reforma-ai/briefback', '--skill', 'briefback', '--yes'],
    ]);
    expect(readFileSync(join(context.cwd, 'BRIEFBACK.md'), 'utf8')).toBe(
      `${GENERATED_MARKER}\n\n# Briefback\n`,
    );
    expect(context.output().stderr).toBe('');
  } finally {
    context.cleanup();
  }
});

test('update replaces a user-owned BRIEFBACK.md when docs are configured', async () => {
  const context = project();
  mkdirSync(join(context.cwd, '.briefback'));
  writeFileSync(
    join(context.cwd, '.briefback/config.json'),
    `${JSON.stringify({ version: 1, components: ['skills', 'workflow'] }, null, 2)}\n`,
  );
  writeFileSync(join(context.cwd, 'BRIEFBACK.md'), '# Mine\n');

  try {
    const status = await runCli(['update', '--yes'], {
      ...context,
      workflow: '# Briefback\n',
      runSkills: (args) => {
        context.calls.push(args);
        return 0;
      },
    });

    expect(status).toBe(0);
    expect(context.calls).toEqual([['update', ...BRIEFBACK_SKILLS, '--yes']]);
    expect(readFileSync(join(context.cwd, 'BRIEFBACK.md'), 'utf8')).toBe(
      `${GENERATED_MARKER}\n\n# Briefback\n`,
    );
    expect(context.output().stderr).toBe('');
  } finally {
    context.cleanup();
  }
});

test('update refreshes only the Briefback skill and generated workflow', async () => {
  const context = project();
  writeFileSync(
    join(context.cwd, 'BRIEFBACK.md'),
    `${GENERATED_MARKER}\n\nold\n`,
  );

  try {
    const status = await runCli(['update', '--project', '--yes'], {
      ...context,
      workflow: '# Current workflow\n',
      runSkills: (args) => {
        context.calls.push(args);
        return 0;
      },
    });

    expect(status).toBe(0);
    expect(context.calls).toEqual([
      ['update', ...BRIEFBACK_SKILLS, '--project', '--yes'],
    ]);
    expect(readFileSync(join(context.cwd, 'BRIEFBACK.md'), 'utf8')).toBe(
      `${GENERATED_MARKER}\n\n# Current workflow\n`,
    );
    expect(context.output().stdout).toContain('Briefback updated.');
  } finally {
    context.cleanup();
  }
});

test('update installs Briefback when the project is not initialized', async () => {
  const context = project();

  try {
    const status = await runCli(['update', '--project', '--yes'], {
      ...context,
      workflow: '# Workflow\n',
      runSkills: (args) => {
        context.calls.push(args);
        return 0;
      },
    });

    expect(status).toBe(0);
    expect(context.calls).toEqual([
      ['add', 'reforma-ai/briefback', '--skill', 'briefback', '--yes'],
    ]);
    expect(readFileSync(join(context.cwd, 'BRIEFBACK.md'), 'utf8')).toBe(
      `${GENERATED_MARKER}\n\n# Workflow\n`,
    );
    expect(context.output().stdout).toContain('Briefback initialized');
  } finally {
    context.cleanup();
  }
});

test('init installs the skill before asking about docs', async () => {
  const context = project();
  let docsPrompted = false;

  try {
    const status = await runCli(['init'], {
      ...context,
      workflow: '# Workflow\n',
      promptDocs: async () => {
        docsPrompted = true;
        expect(context.calls).toEqual([
          ['add', 'reforma-ai/briefback', '--skill', 'briefback'],
        ]);
        return false;
      },
      runSkills: (args) => {
        context.calls.push(args);
        return 0;
      },
    });

    expect(status).toBe(0);
    expect(docsPrompted).toBe(true);
    expect(() =>
      readFileSync(join(context.cwd, 'BRIEFBACK.md'), 'utf8'),
    ).toThrow();
    expect(() =>
      readFileSync(join(context.cwd, 'AGENTS.md'), 'utf8'),
    ).toThrow();
    expect(
      JSON.parse(
        readFileSync(join(context.cwd, '.briefback/config.json'), 'utf8'),
      ),
    ).toEqual({
      version: 1,
      components: ['skills'],
    });
  } finally {
    context.cleanup();
  }
});

test('accepting docs writes BRIEFBACK.md and AGENTS.md after the skill', async () => {
  const context = project();
  writeFileSync(join(context.cwd, 'AGENTS.md'), '# Project\n');

  try {
    const status = await runCli(['init'], {
      ...context,
      workflow: '# Workflow\n',
      promptDocs: async () => true,
      runSkills: (args) => {
        context.calls.push(args);
        return 0;
      },
    });

    expect(status).toBe(0);
    expect(context.calls).toEqual([
      ['add', 'reforma-ai/briefback', '--skill', 'briefback'],
    ]);
    expect(readFileSync(join(context.cwd, 'BRIEFBACK.md'), 'utf8')).toBe(
      `${GENERATED_MARKER}\n\n# Workflow\n`,
    );
    expect(readFileSync(join(context.cwd, 'AGENTS.md'), 'utf8')).toBe(
      `# Project\n\n${AGENTS_POINTER}\n`,
    );
    expect(
      JSON.parse(
        readFileSync(join(context.cwd, '.briefback/config.json'), 'utf8'),
      ),
    ).toEqual({
      version: 1,
      components: ['skills', 'workflow', 'agents'],
    });
  } finally {
    context.cleanup();
  }
});

test('AGENTS.md pointer is idempotent', async () => {
  const context = project();
  writeFileSync(
    join(context.cwd, 'AGENTS.md'),
    `# Project\n\n${AGENTS_POINTER}\n`,
  );

  try {
    await runCli(['init'], {
      ...context,
      workflow: '# Workflow\n',
      promptDocs: async () => true,
      runSkills: () => 0,
    });
    await runCli(['init'], {
      ...context,
      workflow: '# Workflow\n',
      promptDocs: async () => true,
      runSkills: () => 0,
    });

    expect(readFileSync(join(context.cwd, 'AGENTS.md'), 'utf8')).toBe(
      `# Project\n\n${AGENTS_POINTER}\n`,
    );
  } finally {
    context.cleanup();
  }
});

test('AGENTS.md is left alone when @BRIEFBACK.md is already mentioned', async () => {
  const context = project();
  const existing =
    '# Project\n\nSee @BRIEFBACK.md before large changes.\n';
  writeFileSync(join(context.cwd, 'AGENTS.md'), existing);

  try {
    const status = await runCli(['init'], {
      ...context,
      workflow: '# Workflow\n',
      promptDocs: async () => true,
      runSkills: () => 0,
    });

    expect(status).toBe(0);
    expect(readFileSync(join(context.cwd, 'AGENTS.md'), 'utf8')).toBe(
      existing,
    );
    expect(readFileSync(join(context.cwd, 'BRIEFBACK.md'), 'utf8')).toBe(
      `${GENERATED_MARKER}\n\n# Workflow\n`,
    );
  } finally {
    context.cleanup();
  }
});

test('cancelled docs prompt keeps the installed skill', async () => {
  const context = project();

  try {
    const status = await runCli(['init'], {
      ...context,
      promptDocs: async () => null,
      runSkills: (args) => {
        context.calls.push(args);
        return 0;
      },
    });

    expect(status).toBe(0);
    expect(context.calls).toEqual([
      ['add', 'reforma-ai/briefback', '--skill', 'briefback'],
    ]);
    expect(
      JSON.parse(
        readFileSync(join(context.cwd, '.briefback/config.json'), 'utf8'),
      ),
    ).toEqual({
      version: 1,
      components: ['skills'],
    });
    expect(context.output().stdout).toContain('Briefback skill installed');
  } finally {
    context.cleanup();
  }
});

test('update quietly refreshes configured docs and the skill', async () => {
  const context = project();

  try {
    await runCli(['init'], {
      ...context,
      workflow: 'old\n',
      promptDocs: async () => true,
      runSkills: () => 0,
    });

    const status = await runCli(['update'], {
      ...context,
      workflow: 'new\n',
      promptDocs: () => {
        throw new Error('prompt should not run');
      },
      runSkills: (args) => {
        context.calls.push(args);
        return 0;
      },
    });

    expect(status).toBe(0);
    expect(context.calls).toEqual([['update', ...BRIEFBACK_SKILLS]]);
    expect(readFileSync(join(context.cwd, 'BRIEFBACK.md'), 'utf8')).toBe(
      `${GENERATED_MARKER}\n\nnew\n`,
    );
    expect(context.output().stdout).toContain('Briefback updated');
  } finally {
    context.cleanup();
  }
});

test('a delegated failure leaves project files untouched', async () => {
  const context = project();

  try {
    const status = await runCli(['init'], {
      ...context,
      workflow: '# Workflow\n',
      promptDocs: async () => true,
      runSkills: () => 9,
    });

    expect(status).toBe(9);
    expect(() =>
      readFileSync(join(context.cwd, 'BRIEFBACK.md'), 'utf8'),
    ).toThrow();
    expect(() =>
      readFileSync(join(context.cwd, '.briefback/config.json'), 'utf8'),
    ).toThrow();
    expect(context.output().stderr).toContain('install failed with exit code 9');
  } finally {
    context.cleanup();
  }
});
