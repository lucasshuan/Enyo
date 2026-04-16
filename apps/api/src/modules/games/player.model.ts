import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../auth/user.model';
import { Game } from './game.model';
import { LeagueEntry } from '../leagues/league-entry.model';

@ObjectType()
export class Player {
  @Field(() => ID)
  id: string;

  @Field()
  gameId: string;

  @Field()
  userId: string;

  @Field(() => Int)
  currentElo: number;

  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => Game, { nullable: true })
  game?: Game;

  @Field(() => [LeagueEntry], { nullable: true })
  leagueEntries?: LeagueEntry[];

  @Field(() => [PlayerUsername], { nullable: true })
  usernames?: PlayerUsername[];
}

@ObjectType()
export class PlayerUsername {
  @Field(() => ID)
  id: string;

  @Field()
  username: string;

  @Field(() => Player, { nullable: true })
  player?: Player;
}
