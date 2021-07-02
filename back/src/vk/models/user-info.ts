import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserInfo {
  @Field(() => Int, { nullable: true })
  export_id?: number;

  @Field(() => Int, { nullable: true })
  export_peer_id?: number;

  @Field({ nullable: true })
  first_name?: string;

  @Field(() => Int, { nullable: true })
  id?: number;

  @Field({ nullable: true })
  last_name?: string;

  @Field(() => Boolean, { nullable: true })
  can_access_closed?: boolean;

  @Field(() => Boolean, { nullable: true })
  is_closed?: boolean;

  @Field({ nullable: true })
  photo_max?: string;

  @Field({ nullable: true })
  photo_file?: string;

  @Field({ nullable: true })
  deactivated?: string;

  @Field(() => Boolean, { nullable: true })
  can_invite_to_chats?: boolean;
  // @Field({ nullable: true }) Peer?: Peer;
}
