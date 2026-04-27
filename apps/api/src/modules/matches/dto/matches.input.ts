import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateMatchParticipantInput {
  @Field()
  @IsString()
  entryId!: string;

  @Field()
  @IsString()
  outcome!: string;

  @Field(() => Number, { nullable: true })
  @IsOptional()
  score?: number;
}

@InputType()
export class CreateMatchInput {
  @Field(() => ID)
  @IsString()
  eventId!: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  phaseId?: string;

  @Field()
  @IsString()
  format!: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  scheduledAt?: Date;

  @Field({ nullable: true })
  @IsOptional()
  playedAt?: Date;

  @Field(() => [CreateMatchParticipantInput], { nullable: true })
  @IsOptional()
  participants?: CreateMatchParticipantInput[];
}

@InputType()
export class UpdateMatchInput extends PartialType(CreateMatchInput) {}

@InputType()
export class RecordOutcomeInput {
  @Field(() => ID)
  @IsString()
  matchId!: string;

  @Field(() => [CreateMatchParticipantInput])
  participants!: CreateMatchParticipantInput[];

  @Field({ nullable: true })
  @IsOptional()
  playedAt?: Date;
}
