import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { Game } from '../games/game.model';

@ObjectType()
export class League {
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

  @Field(() => Boolean)
  allowDraw: boolean;

  @Field(() => Int)
  kFactor: number;

  @Field(() => Float)
  scoreRelevance: number;

  @Field(() => Int)
  inactivityDecay: number;

  @Field(() => Int)
  inactivityThresholdHours: number;

  @Field(() => Int)
  inactivityDecayFloor: number;

  @Field(() => Int)
  pointsPerWin: number;

  @Field(() => Int)
  pointsPerDraw: number;

  @Field(() => Int)
  pointsPerLoss: number;

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
