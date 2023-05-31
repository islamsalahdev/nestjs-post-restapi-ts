import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../user/user.schema';
import { BaseSchema } from '../database/base-schema';

@Schema({
  versionKey: false,
  timestamps: true,
})
export class Post extends BaseSchema {
  @Prop({ required: true, minlength: 5, trim: true, unique: true })
  name: string;

  @Prop({ required: true, minlength: 5, trim: true })
  description: string;

  @Prop({ index: true })
  slug: string;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
    index: true,
  })
  user: User;

  @Prop([
    {
      type: Types.ObjectId,
      ref: User.name,
    },
  ])
  likes?: User[];
}
export type PostDocument = Post & Document;
export const postSchema = SchemaFactory.createForClass<Post>(Post);
postSchema.pre(/^find/, function () {
  this.populate('user', 'name _id');
});
