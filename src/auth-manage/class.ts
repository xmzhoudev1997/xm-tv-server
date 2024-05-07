import { IsNotEmpty, IsString } from "class-validator";

export class TOKEN_DTO {
  @IsString()
  @IsNotEmpty()
  readonly token: string;
}