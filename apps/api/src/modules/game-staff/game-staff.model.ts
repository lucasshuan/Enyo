import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from '../auth/user.model';

@ObjectType()
export class GameStaff {
  @Field(() => ID)
  id!: string;

  @Field()
  gameId!: string;

  @Field()
  userId!: string;

  @Field(() => [String])
  capabilities!: string[];

  @Field()
  isFullAccess!: boolean;

  @Field()
  createdAt!: Date;

  @Field(() => User, { nullable: true })
  user?: User;
}
