import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsOptional, IsDate } from 'class-validator';

@InputType()
export class CreateEventInput {
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
}

@InputType()
export class UpdateEventInput {
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
}
