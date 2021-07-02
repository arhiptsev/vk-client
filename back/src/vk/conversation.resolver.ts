import { Prisma, Conversation as ConversationPrisma } from '.prisma/client';
import {
  Args,
  Info,
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

  @ResolveField(() => [Message])
  public Message(
    @Parent() { export_id: conversation_export_id }: Conversation,
  ): Promise<Message[]> {
    return this.prisma.message.findMany({
      where: { conversation_export_id },
      orderBy: {
        date: 'desc',
      },
      take: 100,
    });
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
