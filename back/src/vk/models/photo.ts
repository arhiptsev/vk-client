import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { PhotoSize } from './photo-size';
// import { Message } from './message';

@ObjectType()
export class Photo {
  @Field(() => Int, { nullable: true })
  export_id?: number;

  @Field(() => Int, { nullable: true })
  album_id?: number;

  @Field(() => Int, { nullable: true })
  date?: number;

  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => Int, { nullable: true })
  owner_id?: number;

  @Field(() => Boolean, { nullable: true })
  has_tags?: boolean;

  @Field(() => Float, { nullable: true })
  lat?: number;

  @Field(() => Float, { nullable: true })
  long?: number;

  @Field({ nullable: true })
  access_key?: string;

  @Field({ nullable: true })
  text?: string;

  @Field(() => Int, { nullable: true })
  user_id?: string;

  @Field(() => Int, { nullable: true })
  post_id?: string;

  @Field(() => Int, { nullable: true })
  attachment_export_id?: number;

  @Field({ nullable: true })
  photo_256?: string;

  @Field({ nullable: true })
  place?: string;

  @Field({ nullable: true })
  type?: string;

  @Field(() => [PhotoSize], { nullable: true })
  PhotoSize?: PhotoSize[];
}
