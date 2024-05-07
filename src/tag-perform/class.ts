
import { ApiProperty } from '@nestjs/swagger';
export class PERFORM_SIMPLE {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
}
export class PERFORM_TAG {
  @ApiProperty()
  name: string;
  @ApiProperty({ type: [PERFORM_SIMPLE] })
  children: PERFORM_SIMPLE[];
}