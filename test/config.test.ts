import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { test } from 'node:test';

const repoRoot = resolve(import.meta.dirname, '..');
const biomeBin = join(repoRoot, 'node_modules', '.bin', 'biome');

/** Creates a throwaway consumer project that extends the shared config via node_modules. */
function createConsumerProject(): string {
	const projectDir = mkdtempSync(join(tmpdir(), 'biome-config-consumer-'));
	const scopeDir = join(projectDir, 'node_modules', '@polinom-io');
	mkdirSync(scopeDir, { recursive: true });
	writeFileSync(join(projectDir, '.gitignore'), 'node_modules/\n');
	symlinkSync(repoRoot, join(scopeDir, 'biome-config'), 'dir');
	writeFileSync(
		join(projectDir, 'biome.json'),
		JSON.stringify({ extends: ['@polinom-io/biome-config/biome'] }),
	);
	return projectDir;
}

const consumerDir = createConsumerProject();

/** Formats source through stdin in the consumer project and returns the output. */
function format(source: string, fileName = 'input.js'): string {
	const result = spawnSync(
		biomeBin,
		['format', `--stdin-file-path=${fileName}`],
		{
			cwd: consumerDir,
			input: source,
			encoding: 'utf8',
		},
	);
	assert.equal(result.status, 0, result.stderr);
	return result.stdout;
}

/** Lints a file written into the consumer project and returns the exit status. */
function lintStatus(
	source: string,
	fileName = 'lint-target.js',
): number | null {
	writeFileSync(join(consumerDir, fileName), source);
	return spawnSync(biomeBin, ['lint', fileName], {
		cwd: consumerDir,
		encoding: 'utf8',
	}).status;
}

test('uses single quotes in JavaScript', () => {
	assert.equal(format('const name = "px";\n'), "const name = 'px';\n");
});

test('keeps double quotes in JSX attributes', () => {
	assert.equal(
		format("const el = <div className='box' />;\n", 'input.jsx'),
		'const el = <div className="box" />;\n',
	);
});

test('indents with tabs', () => {
	assert.equal(
		format('function f() {\n  return 1;\n}\n'),
		'function f() {\n\treturn 1;\n}\n',
	);
});

test('always adds semicolons', () => {
	assert.equal(format('const a = 1\n'), 'const a = 1;\n');
});

test('always wraps arrow function parameters', () => {
	assert.equal(format('const id = x => x;\n'), 'const id = (x) => x;\n');
});

test('wraps at 80 columns and adds trailing commas to multiline lists', () => {
	const source =
		"const options = { firstOption: 'aaaaaaaaaa', secondOption: 'bbbbbbbbbb', third: 'cc' };\n";
	const expected =
		"const options = {\n\tfirstOption: 'aaaaaaaaaa',\n\tsecondOption: 'bbbbbbbbbb',\n\tthird: 'cc',\n};\n";
	assert.equal(format(source), expected);
});

test('enables the recommended lint rules', () => {
	assert.notEqual(lintStatus('debugger;\n'), 0);
});

test('passes lint on clean code', () => {
	assert.equal(lintStatus("export const greeting = 'hola';\n", 'clean.js'), 0);
});

test('ignores context files synced into .ai/', () => {
	mkdirSync(join(consumerDir, '.ai'), { recursive: true });
	writeFileSync(join(consumerDir, '.ai', 'synced.md'), '# Title\n* item\n');
	const result = spawnSync(biomeBin, ['check', '.ai'], {
		cwd: consumerDir,
		encoding: 'utf8',
	});
	assert.doesNotMatch(`${result.stdout}${result.stderr}`, /synced\.md/);
});

test('ignores files written by release-please', () => {
	writeFileSync(
		join(consumerDir, '.release-please-manifest.json'),
		'{".":"1.0.0"}\n',
	);
	writeFileSync(
		join(consumerDir, 'CHANGELOG.md'),
		'# Changelog\n\n\n* entry\n',
	);
	const result = spawnSync(biomeBin, ['check', '.'], {
		cwd: consumerDir,
		encoding: 'utf8',
	});
	assert.doesNotMatch(
		`${result.stdout}${result.stderr}`,
		/release-please-manifest\.json|CHANGELOG\.md/,
	);
});
