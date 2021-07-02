import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Attachment } from './attachment';

@ObjectType()
export class Message {
  @Field(() => Int, { nullable: true })
  export_id?: number;

  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => Int, { nullable: true })
  parent_id?: number;

  @Field({ nullable: true })
  text?: string;

  @Field(() => Int, { nullable: true })
  user_id?: number;

  @Field(() => Int, { nullable: true })
  from_id?: number;

  @Field(() => Int, { nullable: true })
  peer_id?: number;

  @Field({ nullable: true })
  ref?: string;

  @Field({ nullable: true })
  ref_source?: string;

  @Field(() => Int, { nullable: true })
  date?: number;

  @Field(() => Boolean, { nullable: true })
  read_state?: boolean;

  @Field(() => Int, { nullable: true })
  out?: number;

  @Field(() => Int, { nullable: true })
  update_time?: number;

  @Field(() => Boolean, { nullable: true })
  important?: boolean;

  @Field(() => Int, { nullable: true })
  random_id?: number;

  @Field(() => Boolean, { nullable: true })
  is_hidden?: boolean;

  @Field(() => Int, { nullable: true })
  conversation_message_id?: number;

  @Field({ nullable: true })
  payload?: string;

  @Field(() => Int, { nullable: true })
  conversation_export_id?: number;

  @Field(() => Int, { nullable: true })
  reply_id?: number;

  // @Field(() => Conversation, { nullable: true })
  // Conversation?: Conversation;

  @Field(() => Message, { nullable: true })
  ParentMessage?: Message;

  @Field(() => Message, { nullable: true })
  ReplyMessage?: Message;

  @Field(() => [Attachment], { nullable: true })
  Attachment?: Attachment[];
}
