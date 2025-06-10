import { Test, TestingModule } from '@nestjs/testing';
import { ReviewService } from './review.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../schema/user.entity';
import { Review } from '../schema/review.entity';
import { HttpExceptionStrategy } from '../strategy/http-exception.strategy';
import { Repository } from 'typeorm';

const mockUser = { id: 1, fullName: 'Teste', email: 'a@a.com', password: 'hashedpassword', };
const mockReview = { id: 1, user: 1, comments: 'Great', classification: 5, created_at: new Date() };

const mockUserRepository = () => ({
    findOne: jest.fn(),
});

const mockReviewRepository = () => ({
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
});

const mockHttpStrategy = () => ({
    responseHelper: jest.fn(),
});

describe('ReviewService', () => {
    let service: ReviewService;
    let userRepo: Repository<User>;
    let reviewRepo: Repository<Review>;
    let httpStrategy: HttpExceptionStrategy;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ReviewService,
                { provide: getRepositoryToken(User), useFactory: mockUserRepository },
                { provide: getRepositoryToken(Review), useFactory: mockReviewRepository },
                { provide: HttpExceptionStrategy, useFactory: mockHttpStrategy },
            ],
        }).compile();

        service = module.get<ReviewService>(ReviewService);
        userRepo = module.get<Repository<User>>(getRepositoryToken(User));
        reviewRepo = module.get<Repository<Review>>(getRepositoryToken(Review));
        httpStrategy = module.get<HttpExceptionStrategy>(HttpExceptionStrategy);
    });

    describe('store', () => {
        it('should return user not found', async () => {
            jest.spyOn<any, any>(service, '_validateBody').mockResolvedValue(undefined);
            jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);
            jest.spyOn(httpStrategy, 'responseHelper').mockResolvedValue({ status: 404, message: 'Usuário não existe' });

            const result = await service.store(mockReview);
            expect(result!.status).toBe(404);
        });

        it('should store review successfully', async () => {
            jest.spyOn<any, any>(service, '_validateBody').mockResolvedValue(undefined);
            jest.spyOn(userRepo, 'findOne').mockResolvedValue(mockUser);
            jest.spyOn(reviewRepo, 'create').mockReturnValue(mockReview as any);
            jest.spyOn(reviewRepo, 'save').mockResolvedValue(mockReview as any);
            jest.spyOn(httpStrategy, 'responseHelper').mockResolvedValue({ status: 201, message: 'Success' });

            const result = await service.store(mockReview);
            expect(result!.status).toBe(201);
        });
    });

    describe('index', () => {
        it('should return list of reviews with user info', async () => {
            jest.spyOn(reviewRepo, 'find').mockResolvedValue([mockReview] as any);
            jest.spyOn(userRepo, 'findOne').mockResolvedValue(mockUser);
            jest.spyOn(httpStrategy, 'responseHelper').mockResolvedValue({ status: 200, message: 'Sucesso' });

            const result = await service.index();
            expect(result!.status).toBe(200);
        });
    });

    describe('show', () => {
        it('should return 404 if review not found', async () => {
            jest.spyOn(reviewRepo, 'findOne').mockResolvedValue(null);
            jest.spyOn(httpStrategy, 'responseHelper').mockResolvedValue({ status: 404, message: 'Review não existe' });

            const result = await service.show(1);
            expect(result!.status).toBe(404);
        });

        it('should return 404 if user not found', async () => {
            jest.spyOn(reviewRepo, 'findOne').mockResolvedValue(mockReview);
            jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);
            jest.spyOn(httpStrategy, 'responseHelper').mockResolvedValue({ status: 404, message: 'Usuário não existe' });

            const result = await service.show(1);
            expect(result!.status).toBe(404);
        });

        it('should return review with user info', async () => {
            jest.spyOn(reviewRepo, 'findOne').mockResolvedValue({ ...mockReview } as any);
            jest.spyOn(userRepo, 'findOne').mockResolvedValue(mockUser);
            jest.spyOn(httpStrategy, 'responseHelper').mockResolvedValue({ status: 200, message: 'Sucesso' });

            const result = await service.show(1);
            expect(result!.status).toBe(200);
        });
    });

    describe('update', () => {
        it('should return review not found', async () => {
            jest.spyOn<any, any>(service, '_validateBody').mockResolvedValue(undefined);
            jest.spyOn(reviewRepo, 'findOne').mockResolvedValue(null);
            jest.spyOn(httpStrategy, 'responseHelper').mockResolvedValue({ status: 404, message: 'Review não existe' });

            const result = await service.update(1, { body: mockReview });
            expect(result!.status).toBe(404);
        });

        it('should return user not found', async () => {
            jest.spyOn<any, any>(service, '_validateBody').mockResolvedValue(undefined);
            jest.spyOn(reviewRepo, 'findOne').mockResolvedValue(mockReview);
            jest.spyOn(userRepo, 'findOne').mockResolvedValue(null);
            jest.spyOn(httpStrategy, 'responseHelper').mockResolvedValue({ status: 404, message: 'Usuário não existe' });

            const result = await service.update(1, { body: mockReview });
            expect(result!.status).toBe(404);
        });

        it('should update review successfully', async () => {
            jest.spyOn<any, any>(service, '_validateBody').mockResolvedValue(undefined);
            jest.spyOn(reviewRepo, 'findOne').mockResolvedValue(mockReview);
            jest.spyOn(userRepo, 'findOne').mockResolvedValue(mockUser);
            jest.spyOn(reviewRepo, 'update').mockResolvedValue({} as any);
            jest.spyOn(httpStrategy, 'responseHelper').mockResolvedValue({ status: 201, message: 'Success' });

            const result = await service.update(1, { body: mockReview });
            expect(result!.status).toBe(201);
        });
    });

    describe('delete', () => {
        it('should return review not found', async () => {
            jest.spyOn(reviewRepo, 'findOne').mockResolvedValue(null);
            jest.spyOn(httpStrategy, 'responseHelper').mockResolvedValue({ status: 404, message: 'Review não existe' });

            const result = await service.delete(1);
            expect(result!.status).toBe(404);
        });

        it('should delete review successfully', async () => {
            jest.spyOn(reviewRepo, 'findOne').mockResolvedValue(mockReview);
            jest.spyOn(reviewRepo, 'delete').mockResolvedValue({} as any);
            jest.spyOn(httpStrategy, 'responseHelper').mockResolvedValue({ status: 201, message: 'Success' });

            const result = await service.delete(1);
            expect(result!.status).toBe(201);
        });
    });
});