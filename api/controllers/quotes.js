'use strict';

// Include our "db"
const db = require('../../config/db')();

//GET /movie operationId
const getAll = (req, res, next) => {
  res.json({
    movies: db.find()
  });
}

//POST /movie operationId
const save = (req, res, next) => {
    res.json({
      success: db.save(req.body),
      description: "Movie added to the list!"
    });
}

//GET /movie/{id} operationId
const getOne = (req, res, next) => {
    const id = req.swagger.params.id.value; //req.swagger contains the path parameters
    const movie = db.find(id);

    if (movie) {
        res.json(movie);
    }

    res.status(204).send();
}

//PUT /movie/{id} operationId
const update = (req, res, next) => {
    const id = req.swagger.params.id.value; //req.swagger contains the path parameters
    const movie = req.body;

    if (db.update(id, movie)) {
        res.json({
          success: 1,
          description: "Movie updated!"
        });
    }

    res.status(204).send();
}

//DELETE /movie/{id} operationId
const delMovie = (req, res, next) => {
    const id = req.swagger.params.id.value; //req.swagger contains the path parameters

    if(db.remove(id)){
        res.json({
          success: 1,
          description: "Movie deleted!"
        });
    }

    res.status(204).send();
}

// Exports all the functions to perform on the db
module.exports = {
  getAll,
  save,
  getOne,
  update,
  delMovie
};
