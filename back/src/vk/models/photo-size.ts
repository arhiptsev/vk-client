import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PhotoSize {
  @Field(() => Int)
  export_id: number;

  @Field(() => Int, { nullable: true })
  height: number | null;

  @Field()
  url: string;

  @Field({ nullable: true })
  type: string | null;

  @Field(() => Int, { nullable: true })
  width: number | null;

  @Field(() => Int)
  export_photo_id: number;

  @Field({ nullable: true })
  file: string | null;
}
