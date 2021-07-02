import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Media } from './media';

@ObjectType()
export class Attachment {
  @Field(() => Int, { nullable: true })
  export_id?: number;

  @Field(() => Int, { nullable: true })
  message_export_id: number;

  @Field({ nullable: true })
  type?: string;

  @Field(() => Media, { nullable: true })
  media?: typeof Media;
}
