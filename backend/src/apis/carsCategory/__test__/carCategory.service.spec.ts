import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarCategoryService } from '../carCategory.service';
import { CreateCarCategoryInput } from '../dto/createCarCategory.input';
import { CarCategory } from '../entities/carCategory.entity';

class MockCarCategoryRepository {
  carCategoryDB = [
    {
      id: 'c001',
      name: 'SUV',
      carModel: ['아이오닉5', '투싼', '쏘렌토'],
    },
    {
      id: 'c002',
      name: '스포츠카',
      carModel: ['람보르기니 우라칸', '토요타 GR 86', '페라리 296 GTB'],
    },
    {
      id: 'c003',
      name: '소형',
      carModel: ['코나', '폭스바겐 티록', '쉐보레 트랙스', '아우디 Q2'],
    },
  ];

  find() {
    return this.carCategoryDB;
  }

  save({ name }) {
    this.carCategoryDB.push({
      id: 'c000',
      name,
      carModel: [],
    });
    return {
      id: 'c000',
      name,
      carModel: [],
    };
  }
}

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('CarCategoryService', () => {
  let carCategoryService: CarCategoryService;
  let carCategoryRepository: MockRepository<CarCategory>;

  beforeEach(async () => {
    const carCategoryModule: TestingModule = await Test.createTestingModule({
      providers: [
        CarCategoryService,
        {
          provide: getRepositoryToken(CarCategory),
          useClass: MockCarCategoryRepository,
        },
      ],
    }).compile();

    carCategoryService =
      carCategoryModule.get<CarCategoryService>(CarCategoryService);
    carCategoryRepository = carCategoryModule.get<MockRepository<CarCategory>>(
      getRepositoryToken(CarCategory),
    );
  });

  describe('fetchCarCategory', () => {
    it('CarCategory 조회', async () => {
      const carCategoryRepositorySpyFind = jest.spyOn(
        carCategoryRepository,
        'find',
      );
      const resultData = [
        {
          id: 'c001',
          name: 'SUV',
          carModel: ['아이오닉5', '투싼', '쏘렌토'],
        },
        {
          id: 'c002',
          name: '스포츠카',
          carModel: ['람보르기니 우라칸', '토요타 GR 86', '페라리 296 GTB'],
        },
        {
          id: 'c003',
          name: '소형',
          carModel: ['코나', '폭스바겐 티록', '쉐보레 트랙스', '아우디 Q2'],
        },
      ];

      const result = await carCategoryService.findAll();

      expect(result).toStrictEqual(resultData);
      expect(carCategoryRepositorySpyFind).toBeCalledTimes(1);
    });
  });

  describe('createCarCategory', () => {
    it('CarCategory 생성', async () => {
      const carCategoryRepositorySpySave = jest.spyOn(
        carCategoryRepository,
        'save',
      );

      const createCarCategoryInput: CreateCarCategoryInput = {
        name: '세단',
      };
      const resultData: CarCategory = {
        id: 'c000',
        name: '세단',
        carModel: [],
      };

      const result = await carCategoryService.create({
        createCarCategoryInput,
      });

      expect(result).toStrictEqual(resultData);
      expect(carCategoryRepositorySpySave).toBeCalledTimes(1);
    });
  });
});
