import { userData } from ".";
import { FormValidatorConfiguration } from "./FormValidatorConfiguration";
import { ValidatorFunction } from "./ValidatorFunctionType";
import { ValidatorResult } from "./ValidatortTypes";
import { composeValidators } from "./composeValidators";

export type FormValidateResult<Data extends object> = Partial<{
    [P in keyof Data]: NonNullable<ValidatorResult>;
}>;


export class FormValidator<Data extends object> {

    readonly #validationMap: Map<string, ValidatorFunction<unknown>>;

    constructor(configuration: FormValidatorConfiguration<Data>) {
        this.#validationMap = new Map();

        for (const [key, value] of Object.entries(configuration)) {
            this.#validationMap.set(key, composeValidators(...value as ValidatorFunction<unknown>[]))
        }
    }

    validate(data: Data): FormValidateResult<Data> | null {
        const errors: FormValidateResult<Data>[] = [];

        for (const [propertyName, value] of Object.entries(data)) {
            const validator = this.#validationMap.get(propertyName);

            if (validator) {
                const result = validator(value);

                let lab = document.getElementById(`error-${propertyName}`);

                if (result) {
                    errors.push({ [propertyName]: result } as FormValidateResult<Data>);                  
                    if (lab) { lab.style.visibility = 'visible'; }
                }
                else{                    
                    if (lab) { lab.style.visibility= 'hidden'; }
                }
            }
        }

        return errors.length ? Object.assign({}, ...errors) : null;

    }

    // validate(data: Data): FormValidateResult<Data>| null {
    //     const errors: FormValidateResult<Data>[] = [];      

    //     for (const [propertyName, value] of Object.entries(data )) {
    //         const validator = this.#validationMap.get(propertyName);

    //         if (validator) {
    //             const result = validator(value);

    //             if (result) {
    //                 errors.push({ [propertyName]: result } as FormValidateResult<Data>);
    //             }
    //         }
    //     }

    //     return errors.length ? Object.assign({}, ...errors) : null;

    // }
}