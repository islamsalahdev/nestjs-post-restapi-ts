import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { hash } from 'argon2';
import { BaseSchema } from '../database/base-schema';
import { Exclude } from 'class-transformer';

@Schema({
  versionKey: false,
  timestamps: true,
})
export class User extends BaseSchema {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Exclude()
  @Prop({ required: true })
  password: string;

  @Exclude()
  @Prop()
  refreshToken?: string;

  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }
}

export type UserDocument = User & Document;
export const userSchema = SchemaFactory.createForClass<User>(User);

userSchema.index({ email: 1 });
userSchema.pre('save', async function () {
  if (this.isModified(this.password) || this.isNew) {
    this.password = await hash(this.password);
  }
});
