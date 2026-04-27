import { ObjectType, Field, Int } from '@nestjs/graphql';
import { League } from '../league.model';

@ObjectType()
export class PaginatedLeagues {
  @Field(() => [League])
  nodes!: League[];

  @Field(() => Int)
  totalCount!: number;

  @Field()
  hasNextPage!: boolean;
}
