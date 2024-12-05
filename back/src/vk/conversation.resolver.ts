import { Prisma, Conversation as ConversationPrisma } from '.prisma/client';
import {
  Args,
  Info,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { PrismaService } from 'src/prisma/prisma.service';
import { Attachment } from './models/attachment';
import { Conversation } from './models/conversation';
import { Message } from './models/message';
import { Peer } from './models/peer';

@Resolver(() => Conversation)
export class ConversationResolver {
  constructor(private readonly prisma: PrismaService) {}

  @Query(() => Conversation)
  public conversation(
    @Args('id') export_id: number,
  ): Promise<ConversationPrisma> {
    return this.prisma.conversation.findUnique({ where: { export_id } });
  }

  @Query(() => [Conversation])
  public async conversations(): Promise<ConversationPrisma[]> {
    return this.prisma.conversation.findMany();
  }

  @ResolveField(() => Int)
  public countMessages(
    @Parent() { export_id: conversation_export_id }: Conversation,
  ): Promise<number> {
    return this.prisma.message.count({
      where: { conversation_export_id },

    })
  }

  @ResolveField(() => Peer)
  public Peer(@Parent() { export_id }: Conversation): Promise<Peer> {
    return this.prisma.peer.findUnique({
      where: { conversation_export_id: export_id },
      include: {
        UserInfo: true,
      },
    });
  }
}
