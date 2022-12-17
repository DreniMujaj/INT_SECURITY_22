import {ValidationArguments, ValidationOptions, registerDecorator, validateSync} from 'class-validator';

import {plainToInstance} from 'class-transformer';

/**
 * DynamicKeyValue
 *
 * @param constraints key value constraints
 * @param constraints.key validation function for keys
 * @param constraints.value opt validation function for values (otherwise dto validation is used)
 * @param validationOptions validationOptions
 * @returns ValidationDecorator
 */
export function DynamicKeyValue(constraints: {key: (val: any) => boolean; value: ((val: any) => boolean) | any}, validationOptions?: ValidationOptions): Function {
  return function(object: Object, propertyName: string): void {
    registerDecorator({
      name: 'dynamicKeyValue',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [constraints],
      options: validationOptions,
      validator: {
        /**
         * validate
         *
         * @param object value
         * @param args args
         * @returns isValid
         */
        validate(object: any, args: ValidationArguments) {
          // Key Validation
          const keys = Object.keys(object);
          for (const key of keys) {
            if (!args.constraints[0].key(key)) {
              return false;
            }
          }

          // Value Validation
          const values: object[] = Object.values(object);
          if (!isClass(args.constraints[0].value)) {
            for (const value of values) {
              if (!args.constraints[0].value(value)) {
                return false;
              }
            }
          } else {
            for (const value of values) {
              const dtoObj: object = plainToInstance(args.constraints[0].value, value);
              const errors = validateSync(dtoObj, {
                skipMissingProperties: false,
                forbidNonWhitelisted: true,
                validationError: {
                  target: true,
                  value: true,
                },
              });
              if (errors.length > 0) {
                return false;
              }
            }
          }
          return true;
        },
      },
    });
  };
}

/**
 * isClass
 *
 * @param obj obj
 * @returns isClass
 */
function isClass(obj: any): boolean {
  if (typeof obj !== 'function') {
    return false;
  }
  try {
    obj();
    return false;
  } catch (error: any) {
    if (/^Class constructor/.test(error.message)) {
      return true;
    }
    return false;
  }
}
