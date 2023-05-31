import {
  Controller,
  Delete,
  Get,
  Post,
  Patch,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto, UpdatePostDto } from './dto';
import { CurrentUser, ParseMongoIdPipe, Public } from '../common';
import { User } from '../user/user.schema';
import { FilterPostDto } from './dto/query/filter-post.dto';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  createPost(@CurrentUser() user: User, @Body() creatPostDto: CreatePostDto) {
    return this.postService.createPost(creatPostDto, user);
  }

  @Public()
  @Get()
  getPosts(@Query() filterQuery: FilterPostDto) {
    return this.postService.getPosts(filterQuery);
  }

  @Public()
  @Get(':id')
  getPost(@Param('id', ParseMongoIdPipe) postId: string) {
    return this.postService.getPost(postId);
  }

  @Patch(':id')
  updatePost(
    @CurrentUser() user: User,
    @Param('id', ParseMongoIdPipe) postId: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.updatePost(postId, updatePostDto, user);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deletePost(
    @CurrentUser() user: User,
    @Param('id', ParseMongoIdPipe) postId: string,
  ) {
    return this.postService.deletePost(postId, user);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('like/:id')
  togglelike(
    @Param('id', ParseMongoIdPipe) postId: string,
    @CurrentUser() user: User,
  ) {
    return this.postService.toggleLike(postId, user);
  }
}
