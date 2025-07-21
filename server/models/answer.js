'use strict';
const {
  Model,Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Answer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Answer.init({
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.STRING,
        allowNull:false
      },
      questionId: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      answerIndex: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      isCorrect: {
        type: Sequelize.BOOLEAN,
        allowNull:false
      }
  }, {
    sequelize,
    modelName: 'Answer',
    tableName:'answers'
  });
  return Answer;
};