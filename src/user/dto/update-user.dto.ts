// import { PartialType } from '@nestjs/mapped-types';
// import { CreateUserDto } from './create-user.dto';
// import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

// export class UpdateUserDto extends PartialType(CreateUserDto) {
//   @IsString()
//   @IsOptional()
//   validationToken?: string;

//   @IsOptional()
//   isVerified?: boolean;

//   @IsDate()
//   @IsOptional()
//   validationLinkValidateDate?: Date;

//   @IsNumber()
//   @IsOptional()
//   resendCount: number;

//   @IsOptional()
//   resendCountResetAt: Date
// }



import { IsOptional, IsString, IsBoolean, IsDate, IsNumber } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @IsOptional()
  @IsString()
  validationToken?: string | null;

  @IsOptional()
  @IsDate()
  validationLinkValidateDate?: Date | null;

  @IsOptional()
  @IsNumber()
  resendCount?: number;

   @IsOptional()
  resendCountResetAt?: Date 
}
