"use strict";

const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Shop extends Model {
        // associate
        static associate(models) {
            models.User.hasOne(models.Shop, { foreignKey: 'shopOwnerId', as: 'shop' });
            models.Shop.belongsTo(models.User, { foreignKey: 'shopOwnerId', as: 'shopOwner'})
        }
    }

    Shop.init({
        name: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: "Please enter a valid shop name."
                },
            }
        },
        shopType: {
            type: DataTypes.STRING,
        },

    }, {
        sequelize,
        modelName: "Shop",
    });
    return Shop
}