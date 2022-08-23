const express = require('express');
const userModel = require('../models/model');

const router = express.Router();
/**
 * @swagger
 * definitions:
 *   User:
 *     properties:
 *       name:
 *         type: string
 *       age:
 *         type: integer
 */

/**
 * @swagger
 *
 * /post:
 *   post:
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/User'
 *               required:
 *                  - name
 *                  - age
 *     summary: Add a user to the database
 *     description: Add a user to the database
 *     tags:
 *       - Data Service API
 *     responses:
 *       200:
 *         description: Created successfully. Returns user Id.
 *       500:
 *         description: Something went wrong on server
 */
router.post('/post', async (req, res) => {
    const user = new userModel({
        name: req.body.name,
        age: req.body.age
    });
  
    try {
      await user.save();
    //   res.send(user);
      res.status(200).json(user._id);
    } catch (error) {
      res.status(500).json({message: error.message});
    }
})

/**
 * @swagger
 * /getAll:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - Data Service API
 *     produces:
 *       - application/json     
 *     description: get all users
 *     responses:
 *       200:
 *         description: Returns all the users
 *       500:
 *         description: Something went wrong on Server
 */
router.get('/getAll', async (req, res) => {
    const users = await userModel.find({});
  
    try {
      res.status(200).send(users);
    } catch (error) {
      res.status(500).json({message: error.message});
    }
})

//Get by ID Method
/**
 * @swagger
 * /getOne/{id}:
 *   get:
 *     summary: Get a user by ObjectId
 *     tags:
 *       - Data Service API
 *     produces:
 *       - application/json   
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: The object ID.
 *     responses:
 *       200:
 *         description: Returns the requested user
 *       500:
 *         description: Something went wrong on server
 */
router.get('/getOne/:id', async (req, res) => {
    try{
        const data = await userModel.findById(req.params.id);
        res.status(200).json(data);
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

// patch vs put: 
// PUT is a method of modifying resource where the client sends data that updates the entire resource . 
// PATCH is a method of modifying resources where the client sends partial data that is to be updated without modifying the entire data
/**
 * @swagger
 * /update/{id}:
 *   patch:
 *     summary: Update a user's info by ObjectId
 *     tags:
 *       - Data Service API
 *     produces:
 *       - application/json   
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: The object ID.
 *     requestBody:
 *       required: true
 *       description: Update entire or partial user's info
 *       content:
 *          application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/User'
 *     responses:
 *       200:
 *         description: Returns the updated user's info in JSON format
 *       500:
 *         description: Something went wrong on server
 */
router.patch('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const result = await userModel.findByIdAndUpdate(
            id, updatedData, options
        )

        res.send(result);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
})


/**
 * @swagger
 * /delete/{id}:
 *   delete:
 *     summary: delete a user by ObjectId
 *     tags:
 *       - Data Service API
 *     produces:
 *       - application/json  
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: The ObjectId.
 *     description: Delete a user by ObjectId
 *     responses:
 *       200:
 *         description: Returns successful message
 *       400:
 *         description: Bad request
 */
router.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await userModel.findByIdAndDelete(id)
        res.status(200).send(`User "${data.name}" has been deleted..`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
});

/**
 * @swagger
 * /getUser:
 *   get:
 *     tags:
 *       - Data Service API
 *     produces:
 *       - application/json  
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/User'
 *               required:
 *                  - name
 *     summary: get user(s) by field Name
 *     description: get user(s) by field *Name*
 *     responses:
 *       200:
 *         description: Returns successful message
 *       500:
 *         description: Something went wrong on server
 */
router.get('/getUser', async (req, res) => {
    try {
        const requestedName = req.body?.name;
        const data = await userModel.find({ name: {$eq: requestedName} });
        res.status(200).send(data);
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
});

module.exports = router;