import { NotFoundException, BadRequestException } from '@nestjs/common';
import {
  Document,
  FilterQuery,
  Model,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';

type Pagination = {
  totalDocuments: number;
  currentPage: number;
  nextPage: number;
  prevPage: number;
  remainingDocuments: number;
  totalPages: number;
};

export abstract class AbstractRepository<TDocument extends Document> {
  constructor(protected readonly model: Model<TDocument>) {}

  /**Create Document
   * @returns Promise JSon Object of Document
   * @throws BadRequestException for duplicated unique fields
   */
  async create(data: unknown) {
    try {
      return (await this.model.create(data)).toJSON();
    } catch (err) {
      if (err.code === 11000) {
        const message = `Invalid ${Object.keys(
          err['keyPattern'],
        )} or already exists`;
        throw new BadRequestException(message);
      }
    }
  }

  async findAll(
    filterQuery?: FilterQuery<TDocument>,
  ): Promise<{ documents: TDocument[]; pagination: Pagination }> {
    const { limit, page, sort, skip, select } = filterQuery;

    ['limit', 'page', 'sort', 'skip', 'select'].forEach(
      (feild) => delete filterQuery[feild],
    );

    const itemPerPage = limit || 10;
    const currentPage = page || 1;
    const skipItems = skip || (currentPage - 1) * itemPerPage;

    let sortBy = '-createdAt';
    let selectFeild = '';

    if (sort) {
      sortBy = sort.replace(/,/g, ' ');
    }
    if (select) {
      selectFeild = select.replace(/,/g, ' ');
    }

    const totalDocuments = await this.model
      .countDocuments(filterQuery, { skip })
      .exec();

    const documents = await this.model
      .find(filterQuery, selectFeild, {
        lean: true,
        sort: sortBy,
        skip: skipItems,
        limit: itemPerPage,
      })
      .exec();

    const countRemainingDocuments = totalDocuments - currentPage * itemPerPage;
    const totalPages = Math.ceil(totalDocuments / itemPerPage);

    return {
      documents,
      pagination: {
        totalDocuments,
        totalPages,
        remainingDocuments:
          countRemainingDocuments >= 0 ? countRemainingDocuments : undefined,
        prevPage: currentPage - 1 == 0 ? undefined : currentPage - 1,
        currentPage,
        nextPage: documents.length > itemPerPage ? currentPage + 1 : undefined,
      },
    };
  }

  /** Find Document
   * @returns Promise Document
   * @returns null if Docunemt not found
   */
  async findOne(
    filterQuery: FilterQuery<TDocument>,
    projection?: ProjectionType<TDocument>,
    options?: QueryOptions<TDocument>,
  ): Promise<TDocument | null> {
    return this.model.findOne(filterQuery, projection, options).exec();
  }

  /** FindDocumentAndUpdate
   * @returns Promise TDocunemt
   * @throws NotFoundException if Document Not Found
   */
  async findoneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument> | Partial<TDocument>,
    options?: QueryOptions<TDocument>,
  ): Promise<TDocument> {
    const document = await this.model
      .findOneAndUpdate(filterQuery, update, {
        new: true,
        lean: true,
        runValidators: true,
        ...(options && options),
      })
      .exec();
    if (!document) {
      throw new NotFoundException(`NO Document Found`);
    }

    return document;
  }

  /** Delete Document
   * @returns Promise void
   * @throws NotFoundException if Document Not Found
   */
  async deleteOne(filterQuery: FilterQuery<TDocument>): Promise<void> {
    const result = await this.model.deleteOne(filterQuery).exec();
    if (result.deletedCount == 0)
      throw new NotFoundException(`No Document Found `);
    return;
  }

  /** update Document
   * @returns Promise void
   * @throws NotFoundException if Document Not Found
   */
  async updateOne(
    filterQuery: FilterQuery<TDocument>,
    update: Partial<TDocument> | UpdateQuery<TDocument>,
  ): Promise<void> {
    const result = await this.model
      .updateOne(filterQuery, update, { runValidators: true })
      .exec();
    if (result.modifiedCount == 0) {
      throw new NotFoundException('No Document Found');
    }
    return;
  }
}
