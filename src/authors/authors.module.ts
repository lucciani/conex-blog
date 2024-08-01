import { Module } from '@nestjs/common';
import { AuthorsResolver } from './graphql/resolvers/authors/authors.resolver';
import { PrismaService } from '@/database/prisma/prisma.service';
import { DatabaseModule } from '@/database/database.module';
import { AuthorsPrismaRepository } from './repositories/authors-prisma.repository';

@Module({
  imports: [DatabaseModule],
  providers: [
    AuthorsResolver,
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'AuthorsRepository',
      useFactory: (prisma: PrismaService) => {
        return new AuthorsPrismaRepository(prisma);
      },
      inject: ['PrismaService'],
    },
  ],
})
export class AuthorsModule {}
