import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[a-zA-Z0-9\s]+$/, {
    message: 'SKU must contain only alphanumaric chars and dashes',
  })
  sku: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  @MinLength(4)
  @MaxLength(3)
  @IsOptional()
  currency?: string = 'USD';

  @IsNumber()
  @Min(0)
  stock: number;
}
