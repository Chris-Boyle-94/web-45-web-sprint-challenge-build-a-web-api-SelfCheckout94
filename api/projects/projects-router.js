const express = require("express");

const { logger, validateProjectId } = require("./projects-middleware");

const Projects = require("./projects-model");

const router = express.Router();

router.get("/", logger, async (req, res, next) => {
  try {
    const projects = await Projects.get();
    if (projects.length > 0) {
      res.status(200).json(projects);
    } else {
      res.status(200).send([]);
    }
  } catch (err) {
    next();
  }
});

router.get("/:id", logger, validateProjectId, async (req, res) => {
  res.status(200).json(req.project);
});

// eslint-disable-next-line no-unused-vars
router.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    custom: "Something went wrong with the projects router",
    message: err.message,
    stack: err.stack,
  });
});

module.exports = router;
