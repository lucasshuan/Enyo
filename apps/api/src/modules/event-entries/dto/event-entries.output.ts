import { Field, Int, ObjectType } from '@nestjs/graphql';
import { EventEntry } from '../event-entry.model';

@ObjectType()
export class PaginatedEventEntries {
  @Field(() => [EventEntry])
  nodes!: EventEntry[];

  @Field(() => Int)
  totalCount!: number;

  @Field()
  hasNextPage!: boolean;
}
