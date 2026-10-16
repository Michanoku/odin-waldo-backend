import request from "supertest";
import app from "../app.js";

describe("GET resources, and play the game", () => {
  test("can read all posts without authentication", async () => {
    const response = await request(app).get("/images");
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(4);
  });

  test("can't start a game without a username", async () => {
    const imageResponse = await request(app).get("/images");
    const images = imageResponse.body;
    const response = await request(app).post("/start").send({
        userName: "",
        imageId: images[0].id,
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.errors[0].msg).toBe("Username is required.")
  });
  test("can't start a game with too long username", async () => {
    const imageResponse = await request(app).get("/images");
    const images = imageResponse.body;
    const response = await request(app).post("/start").send({
        userName: "thisusernameissolongitmayaswellbeyourmomma",
        imageId: images[0].id,
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.errors[0].msg).toBe("Username must be between 3 and 32 characters.")
  });
  test("can't start a game with too short username", async () => {
    const imageResponse = await request(app).get("/images");
    const images = imageResponse.body;
    const response = await request(app).post("/start").send({
        userName: "no",
        imageId: images[0].id,
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.errors[0].msg).toBe("Username must be between 3 and 32 characters.")
  });
  test("can't start a game without imageid", async () => {
    const response = await request(app).post("/start").send({
        userName: "Henry",
        imageId: "",
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.errors[0].msg).toBe("Select an image from the menu.")
  });
  test("can't start a game with invalid image id", async () => {
    const response = await request(app).post("/start").send({
        userName: "Henry",
        imageId: "invalid id",
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.errors[0].msg).toBe("Select a valid image from the menu.")
  });

  test("can start a game ", async () => {
    const imageResponse = await request(app).get("/images");
    const images = imageResponse.body;
    const response = await request(app).post("/start").send({
        userName: "Henry",
        imageId: images[0].id,
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("started");
    expect(response.body.token).toBeTruthy();
    expect(response.body.characters.length).toBeGreaterThan(0);
  });
});
