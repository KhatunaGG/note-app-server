import {
  IsOptional,
  IsString,
  IsBoolean,
  IsDate,
  IsNumber,
} from 'class-validator';

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
  resendCountResetAt?: Date;
}
