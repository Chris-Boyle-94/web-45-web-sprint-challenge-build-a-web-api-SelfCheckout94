const express = require("express");

const {
  logger,
  validateActionId,
  validateAction,
} = require("./actions-middlware");

const Actions = require("./actions-model");

const router = express.Router();

router.get("/", logger, async (req, res, next) => {
  try {
    const actions = await Actions.get();
    res.status(200).json(actions);
  } catch (err) {
    next();
  }
});

router.get("/:id", logger, validateActionId, (req, res) => {
  res.status(200).json(req.action);
});

router.post("/", logger, validateAction, async (req, res, next) => {
  try {
    const newAction = await Actions.insert(req.body);
    res.status(201).json(newAction);
  } catch (err) {
    next();
  }
});

router.put(
  "/:id",
  logger,
  validateActionId,
  validateAction,
  async (req, res, next) => {
    const { completed } = req.body;
    try {
      if (typeof completed !== "undefined") {
        await Actions.update(req.params.id, req.body);
        res.status(200).json(req.body);
      } else {
        res.status(400).json({
          message: "Action needs a completed status",
        });
      }
    } catch (err) {
      next();
    }
  }
);

router.delete("/:id", logger, validateActionId, async (req, res, next) => {
  try {
    await Actions.remove(req.params.id);
    res.status(200).json({
      message: "Project successfully deleted.",
    });
  } catch (err) {
    next();
  }
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
