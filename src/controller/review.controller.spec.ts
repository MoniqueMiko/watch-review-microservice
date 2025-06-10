import { Test, TestingModule } from '@nestjs/testing';
import { ReviewController } from './review.controller';
import { ReviewService } from '../service/review.service';

describe('ReviewController', () => {
  let controller: ReviewController;
  let service: ReviewService;

  const mockReviewService = {
    store: jest.fn(),
    index: jest.fn(),
    show: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewController],
      providers: [
        { provide: ReviewService, useValue: mockReviewService },
      ],
    }).compile();

    controller = module.get<ReviewController>(ReviewController);
    service = module.get<ReviewService>(ReviewService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('store', () => {
    it('deve criar uma avaliação com sucesso', async () => {
      const data = { userId: 1, productId: 2, rating: 5, comment: 'Ótimo!' };
      const response = { status: 201, message: 'Criado' };

      mockReviewService.store.mockResolvedValue(response);

      expect(await controller.store(data)).toEqual(response);
      expect(mockReviewService.store).toHaveBeenCalledWith(data);
    });

    it('deve retornar erro se dados forem inválidos', async () => {
      const data = { rating: null };
      const response = { status: 400, message: 'Nota obrigatória' };

      mockReviewService.store.mockResolvedValue(response);

      expect(await controller.store(data)).toEqual(response);
    });
  });

  describe('index', () => {
    it('deve retornar todas as avaliações', async () => {
      const result = [{ id: 1, rating: 5 }];
      mockReviewService.index.mockResolvedValue(result);

      expect(await controller.index()).toEqual(result);
    });
  });

  describe('show', () => {
    it('deve retornar uma avaliação específica', async () => {
      const result = { id: 1, rating: 4 };
      mockReviewService.show.mockResolvedValue(result);

      expect(await controller.show({ id: 1 })).toEqual(result);
    });

    it('deve retornar erro se id não existir', async () => {
      const result = { status: 404, message: 'Avaliação não encontrada' };
      mockReviewService.show.mockResolvedValue(result);

      expect(await controller.show({ id: 999 })).toEqual(result);
    });
  });

  describe('update', () => {
    it('deve atualizar uma avaliação', async () => {
      const data = { id: 1, rating: 3 };
      const result = { status: 200, message: 'Atualizado' };
      mockReviewService.update.mockResolvedValue(result);

      expect(await controller.update(data)).toEqual(result);
    });

    it('deve retornar erro se avaliação não existir', async () => {
      const data = { id: 999, rating: 2 };
      const result = { status: 404, message: 'Não encontrado' };
      mockReviewService.update.mockResolvedValue(result);

      expect(await controller.update(data)).toEqual(result);
    });
  });

  describe('delete', () => {
    it('deve deletar a avaliação', async () => {
      const result = { status: 200, message: 'Removido' };
      mockReviewService.delete.mockResolvedValue(result);

      expect(await controller.delete({ id: 1 })).toEqual(result);
    });

    it('deve retornar erro se id for inválido', async () => {
      const result = { status: 400, message: 'ID inválido' };
      mockReviewService.delete.mockResolvedValue(result);

      expect(await controller.delete({ id: null })).toEqual(result);
    });
  });
});