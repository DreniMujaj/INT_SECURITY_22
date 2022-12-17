import {ValidationArguments, ValidationOptions, registerDecorator} from 'class-validator';

/**
 * IsRegexString
 *
 * @param property property
 * @param validationOptions validationOptions
 * @returns ValidationDecorator
 */
export function IsRegexString(property?: string, validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string): void {
    registerDecorator({
      name: 'isRegexString',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        /**
         * validate
         *
         * @param value value
         * @param args args
         * @returns isValid
         */
        validate(value: any, args: ValidationArguments) {
          let isValid = true;
          try {
            new RegExp(value);
          } catch (e) {
            isValid = false;
          }

          return isValid;
        },
      },
    });
  };
}
