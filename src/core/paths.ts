import { lstat, mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// This module lives at dist/src/core after compilation, including in npm tarballs.
export const packageRoot = fileURLToPath(new URL('../../../', import.meta.url));

export function inside(root: string, relative: string): string {
  const result = path.resolve(root, relative);
  const diff = path.relative(path.resolve(root), result);
  if (!diff || diff === '..' || diff.startsWith(`..${path.sep}`) || path.isAbsolute(diff)) {
    throw new Error(`Path must stay inside its root: ${relative}`);
  }
  return result;
}

export async function exists(file: string): Promise<boolean> {
  try { await lstat(file); return true; }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return false;
    throw error;
  }
}

// Reject symbolic links and Windows junctions in every existing path component.
// This protects ordinary local use; it is not a sandbox against concurrent hostile writers.
export async function noLinks(file: string): Promise<void> {
  const absolute = path.resolve(file);
  const root = path.parse(absolute).root;
  let current = root;
  for (const part of absolute.slice(root.length).split(path.sep).filter(Boolean)) {
    current = path.join(current, part);
    try {
      if ((await lstat(current)).isSymbolicLink()) throw new Error(`Refusing symbolic link or junction: ${current}`);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return;
      throw error;
    }
  }
}

export async function ensureDirectory(directory: string): Promise<void> {
  await noLinks(directory);
  await mkdir(directory, { recursive: true });
  await noLinks(directory);
}

export async function readRegular(file: string): Promise<Buffer> {
  await noLinks(file);
  if (!(await lstat(file)).isFile()) throw new Error(`Expected a regular file: ${file}`);
  return readFile(file);
}
