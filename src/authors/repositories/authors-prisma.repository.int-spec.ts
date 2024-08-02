import { Test, TestingModule } from '@nestjs/testing';
import { AuthorsPrismaRepository } from './authors-prisma.repository';
import { PrismaClient } from '@prisma/client';
import { execSync } from 'node:child_process';
import { NotFoundError } from '@/shared/errors/not-found-error';
import { AuthorDataBuilder } from '../helpers/author-data-builder';

const TIMEOUT = 20000;

describe('AuthorsPrismaRepository Integration Tests', () => {
  let module: TestingModule;
  let repository: AuthorsPrismaRepository;
  const prisma = new PrismaClient();

  beforeAll(async () => {
    execSync('npm run prisma:migratetest');
    await prisma.$connect();
    module = await Test.createTestingModule({}).compile();
    repository = new AuthorsPrismaRepository(prisma as any);
  }, TIMEOUT);

  beforeEach(async () => {
    await prisma.author.deleteMany();
  }, TIMEOUT);

  afterAll(async () => {
    await module.close();
  }, TIMEOUT);

  test(
    'should throws an error when the id is not found',
    async () => {
      await expect(
        repository.findById('796c5a25-1d3b-4228-9a75-06f416c6e218'),
      ).rejects.toThrow(
        new NotFoundError(
          'Author not found using ID 796c5a25-1d3b-4228-9a75-06f416c6e218',
        ),
      );
    },
    TIMEOUT,
  );

  test('should find an author by id', async () => {
    const data = AuthorDataBuilder({});

    const author = await prisma.author.create({
      data,
    });

    const result = await repository.findById(author.id);
    expect(result).toStrictEqual(author);
  });
});
