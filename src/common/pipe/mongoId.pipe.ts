import { Injectable, PipeTransform, NotFoundException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(value: any) {
    if (!isValidObjectId(value)) {
      throw new NotFoundException(`NO items found with that id:${value} `);
    }

    return value;
  }
}
