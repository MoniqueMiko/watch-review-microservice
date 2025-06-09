import { Controller } from '@nestjs/common';
import { ReviewService } from '../service/review.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class ReviewController {
  constructor(private readonly _reviewService: ReviewService) { }

  @MessagePattern('review_store')
  async store(@Payload() data) {
    return this._reviewService.store(data);
  }

  @MessagePattern('review_index')
  async index() {
    return this._reviewService.index();
  }

  @MessagePattern('review_show')
  async show(@Payload() data) {
    return this._reviewService.show(data.id);
  }

  @MessagePattern('review_update')
  async update(@Payload() data) {
    return this._reviewService.update(data.id, data);
  }

  @MessagePattern('review_delete')
  async delete(@Payload() data) {
    return this._reviewService.delete(data.id);
  }
}
