module.exports = {

    standardizeEmail: function (email) {
        return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    },

    standardizeUsername: function (username) {
        return username.match(/^[a-zA-Z0-9]+$/)
    },

    // country code + number
    standardizePhone: function (phone) {
        return phone.match(/^\+[1-9]\d{1,14}$/)
    },

    standardizeIP: function (ip) {
        return ip.match(/^([0-9]{1,3}\.){3}[0-9]{1,3}$/)
    },

    standardizeName: function (name) {
        return name.match(/^[a-zA-Z]+ [a-zA-Z]+$/)
    },

    standardizeDomain: function (domain) {
        domain.match(/^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)+$/)
    }

}