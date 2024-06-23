import { ApiError } from "../utils/ApiError.js";

const validateSchema = (schema) => async (req, res, next) => {
    try {
      console.log(req.body)
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      console.log(error)
      return res
      .status(400)
      .json({
        "message" : error.errors[0].message
      })
    }
};
export default validateSchema;