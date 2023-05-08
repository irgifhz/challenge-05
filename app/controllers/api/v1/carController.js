const { carService, cloudinaryService } = require("../../../services");
const ApplicationError = require("../../../errors/ApplicationError");

exports.createCar = async (req, res) => {
  try {
    const { name, price, size, available } = req.body;
    const image = req.image; //from cloudinary middleware

    if (!name || !price || !size || !available || !image)
      throw new ApplicationError(400, "please complete all input!");

    if (!["small", "medium", "large"].includes(size.toLowerCase()))
      throw new ApplicationError(
        400,
        "size format must be small, medium, or large"
      );

    const createdBy = req.user.id; //from authorize
    const carPayload = await carService.createCar(
      name,
      price,
      size,
      image,
      available,
      createdBy
    );

    res.status(201).json({
      status: "OK",
      message: "Success",
      data: carPayload,
    });
  } catch (err) {
    const image = req.image; //from cloudinary middleware
    image && (await cloudinaryService.delete(image)); //delete image url if failed to db
    res.status(err.statusCode).json({
      status: "FAIL",
      message: err.message,
    });
  }
};

exports.getAllCar = async (req, res) => {
  try {
    const carPayload = await carService.getAllCar();

    res.status(200).json({
      status: "OK",
      message: "Success",
      data: carPayload,
    });
  } catch (err) {
    res.status(err.statusCode).json({
      status: "FAIL",
      message: err.message,
    });
  }
};
exports.getDetailAllCar = async (req, res) => {
  try {
    const carPayload = await carService.getDetailAllCar();

    res.status(200).json({
      status: "OK",
      message: "Success",
      data: carPayload,
    });
  } catch (err) {
    res.status(err.statusCode).json({
      status: "FAIL",
      message: err.message,
    });
  }
};

exports.getCar = async (req, res) => {
  try {
    const car = req.car; //from check car middleware
    res.status(200).json({
      status: "OK",
      message: "Success",
      data: car,
    });
  } catch (err) {
    res.status(err.statusCode).json({
      status: "FAIL",
      message: err.message,
    });
  }
};

exports.getDetailCar = async (req, res) => {
  try {
    const carId = req.params.id; //from params
    const carPayload = await carService.getDetailCar(carId);
    res.status(200).json({
      status: "OK",
      message: "Success",
      data: carPayload,
    });
  } catch (err) {
    res.status(err.statusCode).json({
      status: "FAIL",
      message: err.message,
    });
  }
};

exports.deleteCar = async (req, res) => {
  try {
    const car = req.car; //from check car middleware
    const deletedBy = req.user.id; //from authorize
    await carService.deleteCar(car.id, deletedBy);
    res.status(200).json({
      status: "OK",
      message: "Success",
    });
  } catch (err) {
    res.status(err.statusCode).json({
      status: "FAIL",
      message: err.message,
    });
  }
};

exports.updateCar = async (req, res) => {
  try {
    const car = req.car; //from check car middleware
    const updatedBy = req.user.id; //from authorize
    const carPayload = req.body;
    const image = req.image || car.image; // from cloudinary middleware
    const size = carPayload.size || car.size;
    if (!["small", "medium", "large"].includes(size.toLowerCase()))
      throw new ApplicationError(
        400,
        "size format must be small, medium, or large"
      );
    //Template object payload
    const uploadPayload = {
      name: carPayload.name || car.name,
      price: Number(carPayload.price) || car.price,
      size,
      image,
      available: carPayload.available || car.available,
      updatedBy,
    };
    await carService.updateCar(car.id, uploadPayload);
    res.status(200).json({
      status: "OK",
      message: "Success",
      data: {
        name: uploadPayload.name,
        price: uploadPayload.price,
        size: uploadPayload.size,
        image: uploadPayload.image,
        available: uploadPayload.available,
      },
    });
  } catch (err) {
    const image = req.image;
    image && (await cloudinaryService.delete(image)); //delete image url if failed to db
    res.status(err.statusCode).json({
      status: "FAIL",
      message: err.message,
    });
  }
};