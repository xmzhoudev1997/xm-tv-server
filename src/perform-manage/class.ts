import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsString, isString } from "class-validator";

export class PERFORM_ALL {
    @ApiProperty()
    id: number;
    @ApiProperty()
    name: string;
    @ApiProperty()
    search: string;
    @ApiProperty()
    sources: string[];
    @ApiProperty()
    tagId: number;
    @ApiProperty()
    schedule: number;
  }
  
  export class ADD_DTO {
    @IsNotEmpty()
    @IsString()
    readonly name: string;
    @IsNotEmpty()
    @IsString()
    readonly search: string;
    @IsNotEmpty()
    @IsNumber()
    readonly tagId: number;
    @IsNotEmpty()
    @IsArray()
    readonly sources: string[];
    @IsNotEmpty()
    @IsNumber()
    readonly schedule: number;
}

export class UPDATE_DTO {
  @IsNotEmpty()
  @IsString()
  readonly name: string;
  @IsNotEmpty()
  @IsString()
  readonly search: string;
  @IsNotEmpty()
  @IsNumber()
  readonly tagId: number;
  @IsNotEmpty()
  @IsArray()
  readonly sources: string[];
  @IsNotEmpty()
  @IsNumber()
  readonly schedule: number;
}

export class ID_DTO {
  @IsNumber()
  @IsNotEmpty()
  readonly id: number;
}
export class SORT_DTO {

  @IsNumber()
  @IsNotEmpty()
  readonly sort: number;
}

export class SOURCE_DTO {
  @IsString()
  @IsNotEmpty()
  readonly kwd: string;

  @IsNumber()
  @IsNotEmpty()
  readonly num: number;
}