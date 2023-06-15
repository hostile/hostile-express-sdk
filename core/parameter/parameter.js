module.exports = class Parameter {

    validationFunction
    mappingFunction
    required = false
    name

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
     * Sets the name of the parameter
     * @param name The name of the parameter
     * @returns The current parameter instance
     */
    setName(name) {
        this.name = name;
        return this;
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
     * Returns the parameter's name
     * @return The parameter's name
     */
    getName() {
        return this.name;
    }

    /**
     * Tests if the parameter provided is valid
     * @param req The request object
     * @param args The query or post body
     * @returns If the parameter is valid
     */
    test(req, args) {
        const inQuery = this.name in args;

        if (!(this.name in args) && this.required) {
            return false;
        }

        if (inQuery) {
            let value = args[this.name];

            if (this.mappingFunction !== undefined) {
                value = this.mappingFunction(value);
            }

            if (this.validationFunction !== undefined && !this.validationFunction(value)) {
                return false;
            }

            req.queryParams[this.name] = value;
        }

        return true;
    }
}