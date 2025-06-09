import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpExceptionStrategy } from '../strategy/http-exception.strategy';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { User } from '../schema/user.entity';
import { Review } from '../schema/review.entity';
import { CreateReviewDto } from '../dto/review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(User)
    private readonly _user: Repository<User>,

    @InjectRepository(Review)
    private readonly _review: Repository<Review>,

    private _httpExceptionStrategy: HttpExceptionStrategy,
  ) { }

  async store(data) {
    const validate = await this._validateBody(CreateReviewDto, data);
    if (validate?.status === 400) return await this._httpExceptionStrategy.responseHelper(400, await validate.message);

    const userExist = await this._user.findOne({ where: { id: data.user } });
    if (!userExist) return await this._httpExceptionStrategy.responseHelper(404, 'Usuário não existe');

    const review = this._review.create({ user: data.user, comments: data.comments, classification: data.classification });
    await this._review.save(review);

    return await this._httpExceptionStrategy.responseHelper(201, 'Success');
  }

  async index() {
    const index: any = await this._review.find();

    for (const element of index) {
      const userExist = await this._user.findOne({ where: { id: element.user } });

      element.fullName = userExist?.fullName
      element.email = userExist?.email
    }

    return await this._httpExceptionStrategy.responseHelper(200, index);
  }

  async show(id) {
    const reviewExist: any = await this._review.findOne({ where: { id: id } });
    if (!reviewExist) return await this._httpExceptionStrategy.responseHelper(404, 'Review não existe');

    const userExist = await this._user.findOne({ where: { id: reviewExist.user } });
    if (!userExist) return await this._httpExceptionStrategy.responseHelper(404, 'Usuário não existe');

    reviewExist.fullname = userExist.fullName
    reviewExist.email = userExist.email
    delete reviewExist.user

    return await this._httpExceptionStrategy.responseHelper(200, reviewExist);
  }

  async update(id, data) {
    const validate = await this._validateBody(CreateReviewDto, data.body);
    if (validate?.status === 400) return await this._httpExceptionStrategy.responseHelper(400, await validate.message);

    const reviewExist: any = await this._review.findOne({ where: { id: id } });
    if (!reviewExist) return await this._httpExceptionStrategy.responseHelper(404, 'Review não existe');

    const userExist = await this._user.findOne({ where: { id: reviewExist.user } });
    if (!userExist) return await this._httpExceptionStrategy.responseHelper(404, 'Usuário não existe');

    await this._review.update(id, { user: data.body.user, comments: data.body.comments, classification: data.body.classification });

    return await this._httpExceptionStrategy.responseHelper(201, 'Success');
  }

  async delete(id) {
    console.log('cheguei')
    const reviewExist: any = await this._review.findOne({ where: { id: id } });
    if (!reviewExist) return await this._httpExceptionStrategy.responseHelper(404, 'Review não existe');

    await this._review.delete(id);

    return await this._httpExceptionStrategy.responseHelper(201, 'Success');
  }

  private async _validateBody(dto: any, data: any) {
    if (!dto) return;

    const instance = plainToInstance(dto, data);
    const errors = await validate(instance);

    if (errors.length > 0) {
      const messages = errors
        .map(err => (err.constraints ? Object.values(err.constraints) : []))
        .flat();

      return this._httpExceptionStrategy.responseHelper(400, messages.join(', '));
    }
  }
}
