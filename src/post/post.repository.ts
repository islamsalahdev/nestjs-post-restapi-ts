import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Post, PostDocument } from './post.schema';
import { AbstractRepository } from '../database/abstract.repository';

@Injectable()
export class PostRepository extends AbstractRepository<PostDocument> {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {
    super(postModel);
  }
}
