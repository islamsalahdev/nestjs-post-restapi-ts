import { Injectable, NotFoundException } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { CreatePostDto, UpdatePostDto } from './dto';
import { UserService } from '../user/user.service';
import { User } from '../user/user.schema';
import { FilterPostDto } from './dto/query/filter-post.dto';

@Injectable()
export class PostService {
  constructor(
    private readonly userService: UserService,
    private readonly postRepository: PostRepository,
  ) {}
  async createPost(createPostDto: CreatePostDto, user: User) {
    const post = await this.postRepository.create({
      ...createPostDto,
      user: user._id,
      slug: this.slugify(createPostDto.name),
    });
    return { post };
  }

  async getPosts(filterPostQuery: FilterPostDto) {
    const { name } = filterPostQuery;
    const filterQuery = {
      ...(filterPostQuery && filterPostQuery),
      ...(name && { slug: { $regex: name, $options: 'i' } }),
      ...(name && { name: { $regex: name, $options: 'i' } }),
    };

    const { documents, pagination } = await this.postRepository.findAll(
      filterQuery,
    );
    return { pagination, posts: documents };
  }

  async getPost(postId: string) {
    const post = await this.postRepository.findOne(
      { _id: postId },
      {},
      { lean: true },
    );
    if (!post) {
      throw new NotFoundException('NO post with that id');
    }
    return post;
  }

  async updatePost(postId: string, updatePostDto: UpdatePostDto, user: User) {
    const post = await this.postRepository.findoneAndUpdate(
      { _id: postId, user: user._id },
      updatePostDto,
      {
        lean: true,
      },
    );
    return { post, updated: !!post };
  }

  async deletePost(postId: string, user: User) {
    return this.postRepository.deleteOne({ _id: postId, user: user._id });
  }

  async toggleLike(postId: string, user: User) {
    const { _id: userId } = user;
    const post = await this.postRepository.findOne(
      { _id: postId },
      {},
      { lean: true },
    );
    if (!post) throw new NotFoundException('No post with that id');
    const userExists = post.likes.find(
      (user) => user.toString() === userId.toString(),
    );
    if (userExists) {
      const updatedPost = await this.postRepository.findoneAndUpdate(
        { _id: postId },
        { $pull: { likes: userId } },
      );
      return { post: updatedPost };
    }
    const updatedPost = await this.postRepository.findoneAndUpdate(
      { _id: postId },
      { $push: { likes: userId } },
    );
    return { post: updatedPost };
  }

  slugify(slug: string): string {
    return slug
      .trim()
      .replace(/[^a-zA-Z0-9\s]/gi, '')
      .replace(/\s+/g, '-')
      .toLowerCase();
  }
}
