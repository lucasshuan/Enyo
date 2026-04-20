import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Event {
  @Field(() => ID)
  id: string;

  @Field()
  type: string;

  @Field()
  participationMode: string;

  @Field()
  name: string;

  @Field()
  slug: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  about?: string;

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

  // Not exposed as a GraphQL field — used by EventsResolver.getGame(@Parent())
  gameId: string;
}
