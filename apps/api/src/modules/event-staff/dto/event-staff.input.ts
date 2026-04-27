import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsOptional } from 'class-validator';

@InputType()
export class AddEventStaffInput {
  @Field()
  @IsString()
  eventId!: string;

  @Field()
  @IsString()
  userId!: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  role?: string;
}
