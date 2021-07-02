import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma/prisma.service';
import { Attachment } from './models/attachment';
import { Message } from './models/message';

@Resolver(() => Message)
export class MessageResolver {
  constructor(private readonly prisma: PrismaService) {}

  @Query(() => Message)
  public message(@Args('id') export_id: number): Promise<Message> {
    return this.prisma.conversation.findUnique({ where: { export_id } });
  }

  @Query(() => [Message])
  public messages(
    @Args('conversation_id') conversation_export_id: number,
    @Args('skip') skip: number,
  ): Promise<Message[]> {
    return this.prisma.message.findMany({
      where: { conversation_export_id },
      take: 100,
      skip,
      orderBy: {
        date: 'desc',
      },
    });
  }

  @ResolveField(() => [Attachment])
  public Attachment(
    @Parent() { export_id: message_export_id }: Message,
  ): Promise<Attachment[]> {
    return this.prisma.attachment.findMany({ where: { message_export_id } });
  }
}
