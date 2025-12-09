import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetDistrictsDto {
  @IsNumber()
  @IsNotEmpty()
  province_id: number;
}
