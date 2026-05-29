// module registration
APP.modules.calc = {

    formatLengthFtIn(feetFloat) {
        let feet = Math.floor(feetFloat)
        let inches = Math.round((feetFloat - feet) * 12)

        if (inches === 12) {
            feet++
            inches = 0
        }

        return `${feet}' ${inches}"`
    },

    formatCurrency(v) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(v)
    }
}
