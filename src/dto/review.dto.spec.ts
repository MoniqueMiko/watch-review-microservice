import { validate } from 'class-validator';
import { CreateReviewDto } from './review.dto';

describe('CreateReviewDto', () => {
  it('deve ser válido com todos os campos corretos', async () => {
    const dto = new CreateReviewDto();
    dto.user = 1;
    dto.comments = 'Ótimo atendimento, recomendo!';
    dto.classification = 5;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('deve falhar se os campos estiverem vazios', async () => {
    const dto = new CreateReviewDto();

    const errors = await validate(dto);
    const messages = extractMessages(errors);

    expect(messages).toContain('O campo user é obrigatório');
    expect(messages).toContain('O comentário é obrigatório');
    expect(messages).toContain('A classificação é obrigatória');
  });

  it('deve falhar se o comentário for muito curto', async () => {
    const dto = new CreateReviewDto();
    dto.user = 1;
    dto.comments = 'curto';
    dto.classification = 4;

    const errors = await validate(dto);
    const messages = extractMessages(errors);

    expect(messages).toContain('comentário deve ter no mínimo 6 caracteres');
  });

  it('deve falhar se o comentário for muito longo', async () => {
    const dto = new CreateReviewDto();
    dto.user = 1;
    dto.comments = 'a'.repeat(256);
    dto.classification = 4;

    const errors = await validate(dto);
    const messages = extractMessages(errors);

    expect(messages).toContain('O comentário deve ter no máximo 255 caracteres');
  });

  it('deve falhar se user ou classificação não forem números', async () => {
    const dto = new CreateReviewDto();
    dto.user = 'abc' as any;
    dto.comments = 'Comentário válido';
    dto.classification = 'cinco' as any;

    const errors = await validate(dto);
    const messages = extractMessages(errors);

    expect(messages).toContain('O campo user deve ser um número');
    expect(messages).toContain('A classificação deve ser uma número');
  });
});

function extractMessages(errors: any[]) {
  return errors
    .map(e => (e.constraints ? Object.values(e.constraints) : []))
    .flat();
}
