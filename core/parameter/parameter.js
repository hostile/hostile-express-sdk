module.exports = class Parameter {

    validationFunction;
    mappingFunction;
    malformedMessage;
    required = false;
    name;

    /**
     * Sets the validation function
     * @param validationFunction The function that determines if an input is valid
     * @returns The current Parameter instance
     */
    setValidationFunction(validationFunction) {
        this.validationFunction = validationFunction;
        return this;
    }

    /**
     * Sets the mapping function
     * @param mappingFunction The function that maps the query into a readable state
     * @returns The current Parameter instance
     */
    setMappingFunction(mappingFunction) {
        this.mappingFunction = mappingFunction;
        return this;
    }

    /**
     * Sets the malformed message response
     * @param malformedMessage The response to send
     * @returns The current Parameter instance
     */
    setMalformedMessage(malformedMessage) {
        this.malformedMessage = malformedMessage;
        return this;
    }

    /**
     * Sets the name of the parameter
     * @param name The name of the parameter
     * @returns The current parameter instance
     */
    setName(name) {
        this.name = name;
        return this;
    }

    /**
     * Returns the name of the parameter
     * @returns The name of the parameter
     */
    getName() {
        return this.name;
    }

    /**
     * Sets if the parameter should be required
     * @param required Whether the parameter should be required
     * @returns The current parameter instance
     */
    setRequired(required) {
        this.required = required;
        return this;
    }

    /**
     * Tests if the parameter provided is valid
     * @param req The request object
     * @param args The query or post body
     * @param params The parameters to add the parsed field to
     * @returns If the parameter is valid
     */
    test(req, args, params) {
        const inArgs = this.name in args;

        if (!inArgs && this.required) {
            return `Field ${this.name} not present!`;
        }

        if (inArgs) {
            let value = args[this.name];

            if (this.mappingFunction !== undefined) {
                value = this.mappingFunction(value);
            }

            if (this.validationFunction !== undefined && !this.validationFunction(value)) {
                return this.malformedMessage;
            }

            params[this.name] = value;
        }

        return true;
    }
}
