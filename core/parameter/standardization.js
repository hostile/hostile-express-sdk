module.exports = {

    standardizeEmail: (email) => {
        return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    },

    standardizeUsername: (username) => {
        return username.match(/^[a-zA-Z0-9]+$/)
    },

    // country code + number
    standardizePhone: (phone) => {
        return phone.match(/^\+[1-9]\d{1,14}$/)
    },

    standardizeIP: (ip) => {
        return ip.match(/^([0-9]{1,3}\.){3}[0-9]{1,3}$/)
    },

    standardizeName: (name) => {
        return name.match(/^[a-zA-Z]+ [a-zA-Z]+$/)
    },

    standardizeDomain: (domain) => {
        domain.match(/^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)+$/)
    }
}