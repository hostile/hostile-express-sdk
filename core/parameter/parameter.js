
// standardization already checks length for ip & phone
// not setting a standard bypasses checks
// not setting any length property bypasses checks

class Parameter {

    std;
    minLength;
    maxLength;
    mustBeOfLength;

    constructor(name, type) {
        this.name = name;
        this.type = type;
    }

    setMinMax(min, max) {
        this.minLength = min;
        this.maxLength = max;
    }

    setRequiredLength(len) {
        this.mustBeOfLength = len;
    }

    setStandard(standardFunction) {
        this.std = standardFunction;
    }

    validate(value) {
        if (value === null) return false;

        if (this.std !== null) {
            let standard = this.std(value);

            if (!standard) return false;
        }

        if (typeof value !== this.type) {
            return false;
        }

        if (this.minLength !== null && this.maxLength !== null) {
            return value > this.minLength && value < this.maxLength;
        }

        if (this.mustBeOfLength !== null) {
            return value === this.mustBeOfLength;
        }

        return this.minLength === null;
    }
}

module.exports = Parameter;