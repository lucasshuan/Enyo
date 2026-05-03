import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../auth/user.model';

@ObjectType()
export class GameCounts {
  @Field(() => Int)
  events: number;
}

@ObjectType()
export class Game {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  slug: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  thumbnailImagePath?: string;

  @Field({ nullable: true })
  backgroundImagePath?: string;

  @Field({ nullable: true })
  steamUrl?: string;

  @Field({ nullable: true })
  websiteUrl?: string;

  @Field()
  status: string;

  @Field({ nullable: true })
  authorId?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => User, { nullable: true })
  author?: User;

  @Field(() => GameCounts, { name: '_count', nullable: true })
  count?: GameCounts;
}
