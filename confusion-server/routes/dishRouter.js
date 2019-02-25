import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import Dishes from '../models/dishes';

const dishRouter = express.Router();
dishRouter.use(bodyParser.json())

dishRouter.route('/')
.get((req, res, next) => {
    Dishes.find({}).then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes);
    }, err => next(err))
    .catch(err => next(err));
})
.post((req, res, next) => {
    Dishes.create(req.body)
    .then(dish=> {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, err => next(err))
    .catch(err => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})
.delete((req, res, next) => {
    Dishes.remove({})
    .then(result => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(result);
    }, err => next(err))
    .catch(err => next(err))
});

dishRouter.route('/:dishId')
.get((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then(dish => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, err => next(err))
    .catch(err => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/'+ req.params.dishId);
})
.put((req, res, next) => {
    Dishes.findByIdAndUpdate(req.params.dishId, {$set: req.body}, {new: true})
    .then(dish=> {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, err => next(err))
    .catch(err => next(err));
})
.delete((req, res, next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
    .then(result => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(result);
    }, err => next(err))
    .catch(err => next(err));
});

dishRouter.route('/:dishId/comments')
.get((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then(dish => {
        if(dish){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments);
        }else{
            let err = new Error('Dish ' + req.params.dishId + ' is not found');
            err.statusCode = 404;
            return next(err);
        }
    },err => next(err))
    .catch(err => next(err));
})
.post((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then(dish => {
        if(dish){
            dish.comments.push(req.body);
            dish.save()
            .then(dish => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, err => next(err));
        }else{
            let err = new Error('Dish ' + req.params.dishId + ' is not found');
            err.statusCode = 404;
            return next(err);
        }
    },err => next(err))
    .catch(err => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported');
})
.delete((req, res, next) => {
    Dishes.findById(req.params.id)
    .then(dish => {
        if(dish){
            for(let i = dish.comments.length - 1; i >= 0; i--){
                dish.comments.id(dish.comments[i]._id).remove();
            }
            dish.save()
            .then(dish => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, err => next(err));   
        }else{
            let err = new Error('Dish ' + req.params.dishId + ' is not found');
            err.statusCode = 404;
            return next(err);
        }
    }, err => next(err))
    .catch(err => next(err));
})

dishRouter.route('/:dishId/comments/:commentId')
.get((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then(dish => {
        if(dish){
            if(!dish.comments.id(req.params.commentId)){
                let err = new Error('Comment ' + req.params.commentId + ' is not found');
                err.statusCode = 404;
                return next(err);
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments.id(req.params.commentId));
        }else{
            let err = new Error('Dish ' + req.params.dishId + ' is not found');
            err.statusCode = 404;
            return next(err);
        }
    },err => next(err))
    .catch(err => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('Post operation not supported');
})
.put((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then(dish => {
        if(dish){
            if(!dish.comments.id(req.params.commentId)){
                let err = new Error('Comment ' + req.params.commentId + ' is not found');
                err.statusCode = 404;
                return next(err);
            }

            if(req.body.author){
                dish.comments.id(req.params.commentId).author = req.body.author;
            }
            if(req.body.rating){
                dish.comments.id(req.params.commentId).rating =  req.body.rating;
            }
            if(req.body.comment){
                dish.comments.id(req.params.commentId).comment =  req.body.comment;
            }

            dish.save()
            .then(dish => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, err => next(err));
            
        }else{
            let err = new Error('Dish ' + req.params.dishId + ' is not found');
            err.statusCode = 404;
            return next(err);
        }
    },err => next(err))
    .catch(err => next(err));
})
.delete((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then(dish => {
        if(dish){
            if(!dish.comments.id(req.params.commentId)){
                let err = new Error('Comment ' + req.params.commentId + ' is not found');
                err.statusCode = 404;
                return next(err);
            }
            dish.comments.id(req.params.commentId).remove()
            dish.save()
            .then(dish => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, err => next(err));
        }else{
            let err = new Error('Dish ' + req.params.dishId + ' is not found');
            err.statusCode = 404;
            return next(err);
        }
    },err => next(err))
    .catch(err => next(err));
})

export default dishRouter;