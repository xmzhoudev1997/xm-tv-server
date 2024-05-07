
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class ADD_DTO {
    @IsNotEmpty()
    @IsString()
    readonly name: string;
}

export class ID_DTO {
    @IsNumber()
    @IsNotEmpty()
    readonly id: number;
}

export class RENAME_DTO {

    @IsNotEmpty()
    @IsString()
    readonly name: string;
}

export class SORT_DTO {

    @IsNumber()
    @IsNotEmpty()
    readonly sort: number;
}

export class TAG_TREE {
    @ApiProperty()
    id: number;
    @ApiProperty()
    name: string;
    @ApiProperty()
    sort: number;
    @ApiProperty({ type: () => [TAG_TREE], required: false })
    children?: TAG_TREE[];
  } 

  export class TAG_COUNT {
    @ApiProperty()
    id: number;
    @ApiProperty()
    name: string;
    @ApiProperty()
    subCount: number;
  } 