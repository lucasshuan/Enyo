import { InputType, Field } from '@nestjs/graphql';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

@InputType()
export class GameStaffMemberInput {
  @Field()
  @IsString()
  userId!: string;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  capabilities?: string[];

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isFullAccess?: boolean;
}
