import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsOptional, IsUrl } from 'class-validator';

@InputType()
export class CreateGameInput {
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
  @IsUrl()
  @IsOptional()
  backgroundImagePath?: string;

  @Field({ nullable: true })
  @IsUrl()
  @IsOptional()
  thumbnailImagePath?: string;

  @Field({ nullable: true })
  @IsUrl()
  @IsOptional()
  steamUrl?: string;

  @Field({ nullable: true })
  @IsUrl()
  @IsOptional()
  websiteUrl?: string;

  @Field()
  @IsString()
  authorId!: string;
}

@InputType()
export class UpdateGameInput {
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
  @IsUrl()
  @IsOptional()
  backgroundImagePath?: string;

  @Field({ nullable: true })
  @IsUrl()
  @IsOptional()
  thumbnailImagePath?: string;

  @Field({ nullable: true })
  @IsUrl()
  @IsOptional()
  steamUrl?: string;

  @Field({ nullable: true })
  @IsUrl()
  @IsOptional()
  websiteUrl?: string;
}
