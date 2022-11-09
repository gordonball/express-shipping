"use strict";

const express = require("express");
const { BadRequestError } = require("../expressError");
const router = new express.Router();

const jsonschema = require("jsonschema");
const orderSchema = require("../schemas/orderSchema.json");

const { shipProduct } = require("../shipItApi");
const { json } = require("express");

/** POST /ship
 *
 * VShips an order coming from json body:
 *   { productId, name, addr, zip }
 *
 * Returns { shipped: shipId }
 */

router.post("/", async function (req, res, next) {
  console.log("/shipItApi/ route entered");

  if (req.body === undefined) {
    throw new BadRequestError();
  }

  const result = jsonschema.validate(
    req.body,
    orderSchema,
    { required: true }
  );
  if (!result.valid) {
    console.log("In bad validation");
    const errs = result.errors.map(err => err.stack);
    console.log("err.stack>>>>>>>>>>>>>>>>>>>>",errs);
    throw new BadRequestError(errs);
  }

  const { productId, name, addr, zip } = req.body;
  const shipId = await shipProduct({ productId, name, addr, zip });

  return res.json({ shipped: shipId });
});


module.exports = router;