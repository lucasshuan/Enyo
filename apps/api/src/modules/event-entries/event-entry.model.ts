import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from '../auth/user.model';

@ObjectType()
export class TeamMember {
  @Field(() => ID)
  id: string;

  @Field()
  entryId: string;

  @Field()
  displayName: string;

  @Field({ nullable: true })
  imagePath?: string;

  @Field({ nullable: true })
  userId?: string;

  @Field()
  createdAt: Date;

  @Field(() => User, { nullable: true })
  user?: User;
}

@ObjectType()
export class EntryClaim {
  @Field(() => ID)
  id: string;

  @Field()
  entryId: string;

  @Field()
  userId: string;

  @Field()
  initiatedBy: string;

  @Field()
  status: string;

  @Field({ nullable: true })
  message?: string;

  @Field()
  createdAt: Date;

  @Field(() => User, { nullable: true })
  user?: User;
}

@ObjectType()
export class EventEntry {
  @Field(() => ID)
  id: string;

  @Field()
  eventId: string;

  @Field()
  displayName: string;

  @Field({ nullable: true })
  imagePath?: string;

  @Field({ nullable: true })
  userId?: string;

  @Field()
  entryStatus: string;

  @Field(() => Object)
  stats: unknown;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => [TeamMember], { nullable: true })
  members?: TeamMember[];

  @Field(() => [EntryClaim], { nullable: true })
  claims?: EntryClaim[];
}
