module.exports = (sequelize, DataTypes) => {

    const todo = sequelize.define("todo", {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        due_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
        done: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
    })
    return todo
}