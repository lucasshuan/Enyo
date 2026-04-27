import { Field, ID, ObjectType } from '@nestjs/graphql';
import { League } from '../leagues/league.model';
import { EventStaff } from '../event-staff/event-staff.model';

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
  status: string;

  @Field()
  visibility: string;

  @Field()
  isApproved: boolean;

  @Field({ nullable: true })
  startDate?: Date;

  @Field({ nullable: true })
  endDate?: Date;

  @Field()
  registrationsEnabled: boolean;

  @Field({ nullable: true })
  registrationStartDate?: Date;

  @Field({ nullable: true })
  registrationEndDate?: Date;

  @Field(() => Number, { nullable: true })
  maxParticipants?: number;

  @Field(() => Object, { nullable: true })
  officialLinks?: unknown;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => League, { nullable: true })
  league?: League;

  @Field(() => [EventStaff], { nullable: true })
  staff?: EventStaff[];

  // Not exposed as a GraphQL field — used by EventsResolver.getGame(@Parent())
  gameId: string;
}
