import _Ajv, { AnySchema } from "ajv"
import _AjvErrors from "ajv-errors"
import { InputError } from "../../error/InputError.js"
// temp workaround for ESM: https://github.com/ajv-validator/ajv/issues/2132#issuecomment-1290409907
const Ajv = _Ajv as unknown as typeof _Ajv.default
const AjvErrors = _AjvErrors as unknown as typeof _AjvErrors.default

/**
 * Validate that the analysis options are correct.
 * Throws InputError if not.
 *
 * @throws {InputError}
 */
export function validateInput<ValidatedType>(data: unknown, schema: AnySchema): ValidatedType {
  const ajv = new Ajv({ allErrors: true })
  AjvErrors(ajv /*, {singleError: true} */)
  const validate = ajv.compile(schema)

  if (!validate(data)) {
    throw new InputError(validate.errors ?? [])
  }

  return data as ValidatedType
}