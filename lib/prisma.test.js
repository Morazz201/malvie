import test from 'node:test';
import assert from 'node:assert';
import { PrismaClient } from '@prisma/client';
import { prisma } from './prisma.js';

test('Prisma client instantiation', () => {
  assert.ok(prisma, 'Prisma client should be exported');
  assert.ok(prisma instanceof PrismaClient, 'Exported object should be an instance of PrismaClient');
});

test('Prisma singleton in non-production environments', () => {
  if (process.env.NODE_ENV !== 'production') {
    assert.strictEqual(globalThis.prisma, prisma, 'globalThis.prisma should equal the exported prisma instance');
  }
});
