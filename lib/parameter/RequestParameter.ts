import { Request, Response } from 'express';

export class Parameter<M> {
    private validationFunction: (param: string | M) => boolean = () => true;
    private mappingFunction: (param: string) => M | null = (param: string) => param as M;
    private malformedResponse: (res: Response) => void = (res: Response) =>
        res.status(400).json({
            error: `Field ${this.name} malformed!`,
        });
    private missingResponse: (res: Response) => void = (res: Response) =>
        res.status(400).json({
            error: `Field ${this.name} missing!`,
        });

    private required: boolean = true;
    private name: string;

    /**
     * Sets the validation function
     * @param validationFunction The function that determines if an input is valid
     * @returns The current Parameter instance
     */
    public setValidationFunction(validationFunction: (param: string) => boolean): Parameter<M> {
        this.validationFunction = validationFunction;
        return this;
    }

    /**
     * Sets the mapping function
     * @param mappingFunction The function that maps the query into a readable state
     * @returns The current Parameter instance
     */
    public setMappingFunction(mappingFunction: (param: string) => M | null): Parameter<M> {
        this.mappingFunction = mappingFunction;
        return this;
    }

    /**
     * Sets the malformed message response
     * @param malformedResponse The response callback
     * @returns The current Parameter instance
     */
    public setMalformedResponse(malformedResponse: (res: Response) => void): Parameter<M> {
        this.malformedResponse = malformedResponse;
        return this;
    }

    /**
     * Sets the missing message response
     * @param missingResponse The response callback
     * @returns The current Parameter instance
     */
    public setMissingResponse(missingResponse: (res: Response) => void): Parameter<M> {
        this.missingResponse = missingResponse;
        return this;
    }

    /**
     * Sets if the parameter should be required
     * @param required Whether the parameter should be required
     * @returns The current parameter instance
     */
    public setRequired(required: boolean): Parameter<M> {
        this.required = required;
        return this;
    }

    /**
     * Sets the name of the parameter
     * @param name The name of the parameter
     * @returns The current parameter instance
     */
    public setName(name: string) {
        this.name = name;
        return this;
    }

    /**
     * Returns the name of the parameter
     * @returns The name of the parameter
     */
    public getName(): string {
        return this.name;
    }

    /**
     * Tests if the parameter provided is valid
     * @param _req The request object
     * @param res The response object
     * @param args The query or post body
     * @returns If the parameter is valid
     */
    public test(_req: Request, res: Response, args: NodeJS.Dict<any>): boolean | void {
        if (args && this.name in args) {
            let value: string | M = args[this.name];

            if (this.mappingFunction && this.validationFunction(value)) {
                value = this.mappingFunction(value as string);
            }

            if (!this.validationFunction(value) && !res.closed) {
                this.malformedResponse(res);
                return false;
            }

            args[this.name] = value as M;
        } else if (this.required) {
            this.missingResponse(res);
            return false;
        }

        return true;
    }
}
