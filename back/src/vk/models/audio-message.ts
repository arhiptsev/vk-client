import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AudioMessage {
  @Field(() => Int, { nullable: true })
  export_id?: number;

  @Field(() => Int, { nullable: true })
  attachment_export_id?: number;

  @Field({ nullable: true })
  access_key?: string;

  @Field(() => Int, { nullable: true })
  transcript_error?: number;

  @Field(() => Int, { nullable: true })
  duration?: number;

  @Field(() => Int, { nullable: true })
  id?: number;

  @Field({ nullable: true })
  link_mp3?: string;

  @Field({ nullable: true })
  link_ogg?: string;

  @Field(() => Int, { nullable: true })
  owner_id?: number;

  @Field(() => [Int], { nullable: true })
  waveform?: number[];

  @Field({ nullable: true })
  transcript_state?: string;

  @Field({ nullable: true })
  transcript?: string;

  @Field({ nullable: true })
  file?: string;

  @Field({ nullable: true })
  type?: string;
}
