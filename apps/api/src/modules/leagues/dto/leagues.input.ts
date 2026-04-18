import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { MATCH_FORMATS } from '@ares/core';
import { MatchFormat } from '@prisma/client';
import {
  ArrayNotEmpty,
  IsArray,
  IsString,
  IsOptional,
  IsInt,
  IsNumber,
  IsBoolean,
  IsDate,
  IsIn,
  Min,
} from 'class-validator';

@InputType()
export class CreateLeagueInput {
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
  name: string;

  @Field()
  @IsString()
  slug: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field(() => Int)
  @IsInt()
  @Min(0)
  initialElo: number;

  @Field()
  @IsString()
  ratingSystem: string;

  @Field()
  @IsBoolean()
  allowDraw: boolean;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  kFactor: number;

  @Field(() => Float)
  @IsNumber()
  scoreRelevance: number;

  @Field(() => Int)
  @IsInt()
  @Min(0)
  inactivityDecay: number;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  inactivityThresholdHours: number;

  @Field(() => Int)
  @IsInt()
  @Min(0)
  inactivityDecayFloor: number;

  @Field(() => Int)
  @IsInt()
  @Min(0)
  pointsPerWin: number;

  @Field(() => Int)
  @IsInt()
  @Min(0)
  pointsPerDraw: number;

  @Field(() => Int)
  @IsInt()
  @Min(0)
  pointsPerLoss: number;

  @Field(() => [String])
  @IsArray()
  @ArrayNotEmpty()
  @IsIn(MATCH_FORMATS, { each: true })
  allowedFormats: MatchFormat[];

  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  endDate?: Date;

  @Field()
  @IsString()
  authorId: string;
}

@InputType()
export class UpdateLeagueInput {
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

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  initialElo?: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  ratingSystem?: string;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  allowDraw?: boolean;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  kFactor?: number;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsOptional()
  scoreRelevance?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  inactivityDecay?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  inactivityThresholdHours?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  inactivityDecayFloor?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  pointsPerWin?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  pointsPerDraw?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  pointsPerLoss?: number;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  @IsIn(MATCH_FORMATS, { each: true })
  allowedFormats?: MatchFormat[];
}
