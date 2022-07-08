const { Op } = require("sequelize")

const getFilter = (reqestFilter = {
    limit: 10,
    offset: 0,
    page: 1,
    searchFeild: '',
    searchTerm: '',
    where: {},
}) => {
    const { searchTerm, searchField } = reqestFilter
        reqestFilter.where = { ...reqestFilter.where }
        if (searchTerm && searchField) {
            const obj = {
                ...reqestFilter.where,
                [searchField]: {
                    [Op.like]: `${searchTerm}%`
                }
            }
            reqestFilter.where = obj
        }
        return reqestFilter
}

module.exports = {
    getFilter
}