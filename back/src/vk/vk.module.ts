import { Module } from '@nestjs/common';
import { AttachmentResolver } from './attachment.resolver';
import { ConversationResolver } from './conversation.resolver';
import { MessageResolver } from './message.resolver';

@Module({
  providers: [ConversationResolver, MessageResolver, AttachmentResolver],
  exports: [ConversationResolver, MessageResolver, AttachmentResolver],
})
export class VkModule {}
