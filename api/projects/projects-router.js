const express = require("express");

const {
  logger,
  validateProjectId,
  validateProject,
} = require("./projects-middleware");

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

router.get("/:id", logger, validateProjectId, (req, res) => {
  res.status(200).json(req.project);
});

router.post("/", logger, validateProject, async (req, res, next) => {
  try {
    const newProject = await Projects.insert(req.body);
    res.status(201).json(newProject);
  } catch (err) {
    next();
  }
});

router.put(
  "/:id",
  logger,
  validateProjectId,
  validateProject,
  async (req, res, next) => {
    const { completed } = req.body;
    try {
      if (typeof completed !== "undefined") {
        await Projects.update(req.params.id, req.body);
        res.status(200).json(req.body);
      } else {
        res.status(400).json({
          message: "Project needs a completed status",
        });
      }
    } catch (err) {
      next();
    }
  }
);

router.delete("/:id", logger, validateProjectId, async (req, res, next) => {
  try {
    await Projects.remove(req.params.id);
  } catch (err) {
    next();
  }
});

router.get(
  "/:id/actions",
  logger,
  validateProjectId,
  async (req, res, next) => {
    // const { actions }
    try {
      await Projects.getProjectActions(req.params.id);
      // if(rq.body)
      res.status(200).json(req.body.actions);
    } catch (err) {
      next();
    }
  }
);

// eslint-disable-next-line no-unused-vars
router.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    custom: "Something went wrong with the projects router",
    message: err.message,
    stack: err.stack,
  });
});

module.exports = router;
