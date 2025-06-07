require('dotenv').config();
const db = require('../models')
const fs = require('fs')
const jwt = require('jsonwebtoken')
var searchBuilder = require('sequelize-search-builder');


// create main Model
const Todo = db.todo


// main work

// 1. create todo

const addTodo = async (req, res) => {
    jwt.verify(req.token, process.env.API_KEY, async (err, data) => {
        if (err) {
            res.status(401).send('Unauthorized')
        }else if ( !req.body.title || !req.body.description ) {
            res.status(400).send({data:"all field required"})
        }else {
            try {
                let info = {
                    user_id: data.id,
                    title: req.body.title,
                    description: req.body.description,
                    due_date: req.body.due_date,
                }

                const todo = await Todo.create(info)
                res.status(200).send(todo)
            } catch (error) {
                res.status(400).send({message: error.message})
            }
        }
    })

}



// 2. get all todos

const getAllTodos = async (req, res) => {

    jwt.verify(req.token, process.env.API_KEY, async (err, data) => {
        if (err) {
            res.status(401).send('Unauthorized')
        }else{
            try {

                const { orderBy = 'id', order = 'ASC' } = req.query;

                const todos = await Todo.findAll({
                    where: { user_id: data.id },
                    order: [[orderBy, order.toUpperCase()]]
                });
                res.status(200).send(todos);
            } catch (error) {
                res.status(500).send({ message: error.message });
            }
        }
    });
}



// 3. get single todo

const getOneTodo = async (req, res) => {

    jwt.verify(req.token, process.env.API_KEY, async (err, data) => {
        if (err) {
            res.status(401).send('Unauthorized')
        } else {
            try {
                let todoId = req.params.id
                let todo = await Todo.findOne({ where: { id: todoId, user_id: data.id } });
    
                if (!todo) {
                    res.status(404).send({ message: 'Task not found' });
                }else{
                    res.status(200).send(todo);
                }
            } catch (error) {
                res.status(500).send({ message: error.message });
            }
        }
    });

}



// 4. update Todo

const updateTodo = async (req, res) => {

    jwt.verify(req.token, process.env.API_KEY, async (err, data) => {
        let todoId = req.params.id
        if (err) {
            res.status(401).send('Unauthorized')
        }
        let todo = await Todo.findOne({ where: { id: todoId, user_id: data.id } });
        if (!todo) {
            res.status(404).send({ message: 'Task not found' });
        } else if (todo.user_id !== data.id) {
            res.status(401).send('Unauthorized')
        } else{

            let todoPost = {
                title: req.body.title,
                description: req.body.description,
                due_date: req.body.due_date,
            }
            const todo = await Todo.update(todoPost, { where: { id: todoId }})
            res.status(200).send(todo)
        }
    })


}





// 5. update Todo

const updateTodoStatus = async (req, res) => {

    jwt.verify(req.token, process.env.API_KEY, async (err, data) => {
        let todoId = req.params.id
        if (err) {
            res.status(401).send('Unauthorized')
        }
        let todo = await Todo.findOne({ where: { id: todoId, user_id: data.id } });
        if (!todo) {
            res.status(404).send({ message: 'Task not found' });
        } else if (todo.user_id !== data.id) {
            res.status(401).send('Unauthorized')
        } else{

            let todoPost = {
                done: req.body.done,
            }
            const todo = await Todo.update(todoPost, { where: { id: todoId }})
            res.status(200).send(todo)
        }
    })


}



// 6. delete todo by id

const deleteTodo = async (req, res) => {

    jwt.verify(req.token, process.env.API_KEY, async (err, data) => {
        let todoId = req.params.id
        if (err) {
            res.status(401).send('Unauthorized')
        } 
        
        let todo = await Todo.findOne({ where: { id: todoId, user_id: data.id } });
        if (todo.user_id !== data.id) {
            res.status(401).send('Unauthorized')
        } else if (!todo) {
            res.status(404).send({ message: 'Task not found' });
        } else{
            await Todo.destroy({ where: { id: todoId }} )
            res.status(200).send('Task is deleted !')
        }
    })
}





// 7. Verify Token

const ensureToken = async (req, res, next) => {
    const bearerHeader = req.headers["authorization"]
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ")
        const bearerToken = bearer[1]
        req.token = bearerToken
        next()
    }else{
        res.sendStatus(403)
    }
}



module.exports ={
    addTodo,
    getAllTodos,
    getOneTodo,
    updateTodo,
    updateTodoStatus,
    deleteTodo,
    ensureToken,
}
