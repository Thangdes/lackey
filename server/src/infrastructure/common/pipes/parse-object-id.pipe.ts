import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

/**
 * Pipe validate MongoDB ObjectId (24-char hex string).
 * Dùng thay cho ParseUUIDPipe khi DB là MongoDB.
 */
@Injectable()
export class ParseObjectIdPipe implements PipeTransform<string, string> {
  private static readonly OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;

  transform(value: string): string {
    if (!ParseObjectIdPipe.OBJECT_ID_REGEX.test(value)) {
      throw new BadRequestException(
        `Validation failed (ObjectId expected, received: "${value}")`,
      );
    }
    return value;
  }
}
