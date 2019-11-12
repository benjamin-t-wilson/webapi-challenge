const express = require("express");
const db = require("../data/helpers/projectModel");

const router = express.Router();

router.get("/", (req, res) => {
  db.get()
    .then(projects => {
      res.status(200).json(projects);
    })
    .catch(err => {
      res.status(500).json({ message: "Error getting projects", err });
    });
});

router.get("/:id", validateID, (req, res) => {
  const id = req.params.id;
  db.get(id)
    .then(project => {
      res.status(200).json(project);
    })
    .catch(err => {
      res.status(500).json({ message: "Error getting project", err });
    });
});

router.post("/", validateBody, validateProjectKeys, (req, res, next) => {
  const postBody = req.body;
  db.insert(postBody)
    .then(newProj => {
      res.status(201).json(newProj);
    })
    .catch(err => {
      res.status(500).json({ message: "Error adding new project", err });
    });
});

router.put("/:id", validateID, validateBody, (req, res, next) => {
  const id = req.params.id;
  const projectUpdate = req.body;
  router
    .update(id, projectUpdate)
    .then(updatedProject => {
      res.status(200).json(updatedProject);
    })
    .catch(err => {
      res.status(500).json({ message: "Error updating project", err });
    });
});

router.delete("/:id", validateID, (req, res) => {
  const id = req.params.id;

  db.remove(id)
    .then(deleted => {
      res.status(200).json(deleted);
    })
    .catch(err => {
      res.status(500).json({ message: "Error deleting project", err });
    });
});

router.get("/:id/actions", validateID, (req, res) => {
  const id = req.params.id;

  db.getProjectActions(id)
    .then(actions => {
      res.status(200).json(actions);
    })
    .catch(err => {
      res.status(500).json({ message: "Error retrieving actions", err });
    });
});
// *** MIDDLEWARE ***

function validateID(req, res, next) {
  const id = req.params.id;
  db.get(id)
    .then(project => {
      project
        ? next()
        : res
            .status(404)
            .json({ message: "Project with that ID cannot be found" });
    })
    .catch(err => {
      res.status(500).json({ message: "Error retrieving project", err });
    });
}

function validateBody(req, res, next) {
  const body = req.body;
  Object.keys(body).length > 0
    ? next()
    : res.status(400).json({ message: "Missing body on request" });
}

function validateProjectKeys(req, res, next) {
  const body = req.body;

  body.name && body.description
    ? next()
    : res
        .status(400)
        .json({ message: "Missing name or description key on body" });
}
module.exports = router;
