import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma/prisma.service';
import { Attachment } from './models/attachment';
import { Media } from './models/media';
import { Message } from './models/message';

@Resolver(() => Attachment)
export class AttachmentResolver {
  constructor(private readonly prisma: PrismaService) {}

  @Query(() => Attachment)
  public attachment(@Args('id') export_id: number): Promise<Attachment> {
    return this.prisma.attachment.findUnique({ where: { export_id } });
  }

  @Query(() => [Attachment])
  public attachments(export_id): Promise<Attachment[]> {
    return this.prisma.attachment.findMany({ where: { export_id } });
  }

  @ResolveField(() => Media)
  public media(@Parent() { export_id }: Message): Promise<typeof Media> {
    return this.prisma.attachment
      .findUnique({
        where: { export_id },
        include: {
          AudioMessage: true,
          Photo: { include: { PhotoSize: true } },
          Video: { include: { VideoFile: true } },
        },
      })
      .then(({ AudioMessage, Photo, Video }) => AudioMessage || Photo || Video);
  }
}
