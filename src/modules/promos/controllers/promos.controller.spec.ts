import { Test, TestingModule } from '@nestjs/testing';
import { PromosService } from '../services/promos.service';
import { PromosController } from './promos.controller';

const mockPromoCode = 'EKPT0940KN5';

describe('PromosController', () => {
  let promosController: PromosController;
  let promosService: PromosService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [PromosController],
      providers: [
        {
          provide: PromosService,
          useValue: {
            getPromoByCode: jest.fn().mockResolvedValue({
              id: 1,
              code: 'EKPT0940KN5',
              discount: 23,
              type: 'absolute',
            }),
          },
        },
      ],
    }).compile();

    promosController = moduleRef.get<PromosController>(PromosController);
    promosService = moduleRef.get<PromosService>(PromosService);
  });

  describe('getPromoByCode', () => {
    it('should return an object of promo', async () => {
      await expect(
        promosController.getPromoByCode(mockPromoCode),
      ).resolves.toEqual({
        id: 1,
        code: 'EKPT0940KN5',
        discount: 23,
        type: 'absolute',
      });
    });
  });
});
