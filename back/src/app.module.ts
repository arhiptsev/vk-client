import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { VkModule } from './vk/vk.module';
import { ApolloDriver } from '@nestjs/apollo';

@Module({
  imports: [
    PrismaModule,
    VkModule,
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'schema.gql'),
      definitions: {
        path: join(process.cwd(), '../front/src/graphql/types/index.ts'),
      },
      context: ({ req }) => ({ req }),
      playground: true,
      driver: ApolloDriver,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
    }),
  ],
})
export class AppModule {}
