import type { ISignupFields } from '@/types/auth'

export function signUpFieldsChecks(
  signupFields: ISignupFields,
): string | false {
  Object.entries(signupFields).forEach(([fieldName, fieldValue]) => {
    if (fieldValue.length < 1) {
      return `${fieldName} é necessário.`
    }
  })

  if (signupFields.password !== signupFields.passwordConfirmation) {
    return `Passwords must be the exact same`
  }

  return false
}
