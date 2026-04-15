import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Game } from '../games/game.model';

@ObjectType()
export class Ranking {
  @Field(() => ID)
  id: string;

  @Field()
  gameId: string;

  @Field()
  name: string;

  @Field()
  slug: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Int)
  initialElo: number;

  @Field()
  ratingSystem: string;

  @Field()
  type: string;

  @Field()
  isApproved: boolean;

  @Field({ nullable: true })
  startDate?: Date;

  @Field({ nullable: true })
  endDate?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => Game)
  game: Game;
}
