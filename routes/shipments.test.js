"use strict";

const request = require("supertest");
const app = require("../app");


describe("POST /", function () {
  test("valid", async function () {
    const resp = await request(app).post("/shipments").send({
      productId: 1000,
      name: "Test Tester",
      addr: "100 Test St",
      //zip: "12345-6789", fixed to match api fields
      zipcode: "12345-6789",
    });


  });

  test("throws error if empty request body", async function () {
    const resp = await request(app)
      .post("/shipments")
      .send();
    expect(resp.statusCode).toEqual(400);
  });

  test("throws error for invalid zipcode format", async function () {
    const resp = await request(app)
      .post("/shipments")
      .send(
        {
          "productId": 1001,
          "name": "good name",
          "addr": "123 good place",
          "zipcode": 80000
        }
      );
    expect(resp.statusCode).toEqual(400);
    expect(resp.body.error.message.length).toEqual(1);
    expect(resp.body.error.message[0])
      .toEqual("instance.zipcode is not of a type(s) string");
  });

  test("throws error for missing zipcode and invalid address", async function () {
    const resp = await request(app)
      .post("/shipments")
      .send(
        {
          "productId": 1001,
          "name": "good name",
          "addr": 123,
        }
      );
    expect(resp.statusCode).toEqual(400);
    expect(resp.body.error.message.length).toEqual(2);
    expect(resp.body.error.message[0])
      .toContain("instance.addr is not of a type(s) string");

    expect(resp.body.error.message[1])
      .toContain("instance requires property \"zipcode\"");

  });
});



  //expect(resp.body).toEqual({ shipped: expect.any(Number) });
    // expect(resp.body).toEqual({
    //        "message": [
    //          "instance is not allowed to have the additional property \"zip\"",
    //          "instance requires property \"zipcode\"",
    //      ],
    //        "status": 400,
    //     });