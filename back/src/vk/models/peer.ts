import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Conversation } from './conversation';
import { Message } from './message';
import { UserInfo } from './user-info';

@ObjectType()
export class Peer {
  @Field(() => ID, { nullable: true })
  export_id?: number;
  @Field(() => Int, { nullable: true })
  conversation_export_id?: number;
  @Field(() => Int, { nullable: true })
  id?: number;
  @Field({ nullable: true })
  type?: string;
  @Field(() => Int, { nullable: true })
  local_id?: number;
  @Field(() => Conversation, { nullable: true })
  Conversation?: number;
  @Field(() => UserInfo)
  UserInfo: UserInfo;
}
