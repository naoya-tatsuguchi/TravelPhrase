import { nanoid } from 'nanoid';

export function genId(): string {
  return nanoid();
}

export function now(): number {
  return Date.now();
}
