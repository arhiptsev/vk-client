import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Message } from './message';
import { Peer } from './peer';

@ObjectType()
export class Conversation {
  @Field(() => Int)
  export_id: number;

  @Field(() => Int, { nullable: true })
  last_message_id?: number;

  @Field(() => Int, { nullable: true })
  in_read?: number;

  @Field(() => Int, { nullable: true })
  out_read?: number;

  @Field(() => Boolean, { nullable: true })
  is_marked_unread?: boolean;

  @Field(() => Boolean, { nullable: true })
  important?: boolean;

  @Field(() => Boolean, { nullable: true })
  can_send_money?: boolean;

  @Field(() => Boolean, { nullable: true })
  can_receive_money?: boolean;

  @Field(() => [Message], { nullable: true })
  Message?: Message[];

  @Field(() => Peer)
  Peer: Peer;
}
