import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateEventEntryInput {
  @Field()
  @IsString()
  eventId!: string;

  @Field()
  @IsString()
  displayName!: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  userId?: string;
}

@InputType()
export class UpdateEventEntryInput extends PartialType(CreateEventEntryInput) {}

@InputType()
export class ClaimEntryInput {
  @Field(() => ID)
  @IsString()
  entryId!: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  message?: string;
}

@InputType()
export class ReviewClaimInput {
  @Field(() => ID)
  @IsString()
  claimId!: string;

  @Field()
  @IsString()
  status!: string;
}
