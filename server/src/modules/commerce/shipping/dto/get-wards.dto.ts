import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetWardsDto {
  @IsNumber()
  @IsNotEmpty()
  district_id: number;
}
