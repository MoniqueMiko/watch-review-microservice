import { Review } from './review.entity';

describe('Review Entity', () => {
  it('deve criar um review válido', () => {
    const review = new Review();
    review.id = 1;
    review.user = 42;
    review.comments = 'Excelente atendimento!';
    review.classification = '5';
    review.created_at = new Date('2025-06-10T10:00:00Z');

    expect(review).toBeDefined();
    expect(review.id).toBe(1);
    expect(review.user).toBe(42);
    expect(review.comments).toBe('Excelente atendimento!');
    expect(review.classification).toBe('5');
    expect(review.created_at).toEqual(new Date('2025-06-10T10:00:00Z'));
  });

  it('deve permitir reviews com mesmo user e comentários diferentes', () => {
    const review1 = new Review();
    review1.user = 42;
    review1.comments = 'Primeira visita';
    review1.classification = '4';

    const review2 = new Review();
    review2.user = 42;
    review2.comments = 'Segunda visita, ainda melhor';
    review2.classification = '5';

    expect(review1.user).toBe(review2.user);
    expect(review1.comments).not.toBe(review2.comments);
  });

  it('simula erro de classificação inválida (negócio fora da entidade)', () => {
    const review = new Review();
    review.user = 42;
    review.comments = 'Muito ruim';
    review.classification = '10';

    const invalidClassifications = ['0', '10', 'abc'];
    const isInvalid = invalidClassifications.includes(review.classification);
    expect(isInvalid).toBe(true);
  });
});
