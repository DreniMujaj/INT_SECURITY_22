import {IsString, isNumberString, isString} from 'class-validator';
import {Request, Response} from 'express';

import {DynamicKeyValue} from './dynamicKey.validator';
import Validator from '../validator';

describe('Dynamic Key Validator', () => {
  it('valid object', async () => {
    const body = {
      test: {
        1234: {hallo: 'test1'},
        13: {hallo: 'test2'},
      },
    };
    Validator.dtoValidationMiddleware(TestingDTO)({body} as Request, {} as Response, (err) => {
      expect(err).toBeUndefined();
    });
  });

  it('invalid keys', async () => {
    const body = {
      test: {
        '123d': {hallo: 'test1'},
        '13': {hallo: 'test2'},
      },
    };
    Validator.dtoValidationMiddleware(TestingDTO)({body} as Request, {} as Response, (err) => {
      expect(err).toBeDefined();
    });
  });

  it('invalid value', async () => {
    const body = {
      test: {
        '123': {hall: 'test1'},
        '13': {hallo: 'test2'},
      },
    };
    Validator.dtoValidationMiddleware(TestingDTO)({body} as Request, {} as Response, (err) => {
      expect(err).toBeDefined();
    });
  });

  it('valid object value as function', async () => {
    const body = {
      test: {
        '123': 'tesdfd',
        '13': 'tesdfd',
      },
    };
    Validator.dtoValidationMiddleware(Testing2DTO)({body} as Request, {} as Response, (err) => {
      expect(err).toBeUndefined();
    });
  });

  it('invalid value value as function', async () => {
    const body = {
      test: {
        '123': 1234,
        '13': 'tesdfd',
      },
    };
    Validator.dtoValidationMiddleware(Testing2DTO)({body} as Request, {} as Response, (err) => {
      expect(err).toBeDefined();
    });
  });
});

/**
 * NestedDTO
 */
class NestedDTO {
  @IsString()
    hallo!: string;
}

/**
 * DynamicDTO
 */
class DynamicDTO {
  [year: number]: NestedDTO;
}

/**
 * Dynamic2DTO
 */
class Dynamic2DTO {
  [year: number]: string;
}

/**
 * Testing DTO
 */
class TestingDTO {
  @DynamicKeyValue({key: isNumberString, value: NestedDTO})
  public test!: DynamicDTO;
}

/**
 * Testing2 DTO
 */
class Testing2DTO {
  @DynamicKeyValue({key: isNumberString, value: isString})
  public test!: Dynamic2DTO;
}
