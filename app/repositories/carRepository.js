const { Car, User } = require("../models");

exports.createCar = (createArgs) => {
  return Car.create(createArgs);
};

exports.updateCar = (carId, updateArgs) => {
  return Car.update(updateArgs, { where: { id: carId } });
};

exports.deleteCar = (carId) => {
  return Car.destroy({ where: { id: carId } });
};

exports.getAllCar = () => {
  return Car.findAll();
};

exports.getCarById = (carId) => {
  return Car.findOne({ where: { id: carId } });
};

exports.getDetailAllCar = () => {
  return Car.findAll({
    include: [
      {
        model: User,
        as: "created",
      },
      {
        model: User,
        as: "updated",
      },
      {
        model: User,
        as: "deleted",
      },
    ],
    attributes: { exclude: ["createdBy", "updatedBy", "deletedBy"] },
    paranoid: false,
  });
};

exports.getDetailCar = (carId) => {
  return Car.findByPk(carId, {
    include: [
      {
        model: User,
        as: "created",
      },
      {
        model: User,
        as: "updated",
      },
      {
        model: User,
        as: "deleted",
      },
    ],
    attributes: { exclude: ["createdBy", "updatedBy", "deletedBy"] },
    paranoid: false,
  });
};