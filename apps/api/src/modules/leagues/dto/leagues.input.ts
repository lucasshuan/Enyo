import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  IsDate,
  IsInt,
  IsObject,
  Min,
} from 'class-validator';

@InputType()
export class InitialStaffInput {
  @Field()
  @IsString()
  userId!: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  role?: string;
}

@InputType()
export class InitialEntryInput {
  @Field()
  @IsString()
  displayName!: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  userId?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  imageUrl?: string;
}

@InputType()
export class CreateLeagueEventInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  gameId?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  gameName?: string;

  @Field()
  @IsString()
  name!: string;

  @Field()
  @IsString()
  slug!: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  about?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  participationMode?: string;

  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  endDate?: Date;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  status?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  visibility?: string;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  registrationsEnabled?: boolean;

  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  registrationStartDate?: Date;

  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  registrationEndDate?: Date;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @Min(1)
  @IsOptional()
  maxParticipants?: number;

  @Field(() => Object, { nullable: true })
  @IsOptional()
  officialLinks?: unknown;
}

@InputType()
export class CreateLeagueConfigInput {
  @Field()
  @IsString()
  classificationSystem!: string;

  /**
   * Config JSON — shape depends on classificationSystem:
   * ELO:    { initialElo, kFactor, scoreRelevance, inactivityDecay,
   *           inactivityThresholdHours, inactivityDecayFloor }
   * POINTS: { pointsPerWin, pointsPerDraw, pointsPerLoss }
   */
  @Field(() => Object)
  @IsObject()
  config!: object;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  allowDraw?: boolean;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  allowedFormats?: string[];

  @Field(() => Object, { nullable: true })
  @IsOptional()
  customFieldSchema?: unknown;
}

@InputType()
export class UpdateLeagueEventInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  slug?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  about?: string;

  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  endDate?: Date;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  status?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  visibility?: string;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  registrationsEnabled?: boolean;

  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  registrationStartDate?: Date;

  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  registrationEndDate?: Date;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @Min(1)
  @IsOptional()
  maxParticipants?: number;

  @Field(() => Object, { nullable: true })
  @IsOptional()
  officialLinks?: unknown;
}

@InputType()
export class UpdateLeagueConfigInput extends PartialType(
  CreateLeagueConfigInput,
) {}
