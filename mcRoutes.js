const express = require('express');
const moldCostModel = require('../models/mcModels.js');
const _ = require('lodash');
const db = require('../mongoUtils');
const mongoose = require('mongoose');


const router = express.Router();
/**
 * @swagger
 * definitions:
 *   moldcost:
 *     properties:
 *       userId:
 *         type: string
 *       templates:
 *         type: object
 */

/**
 * @swagger
 * /{userId}/getAllTemplates:
 *   get:
 *     summary: Get all templates
 *     tags:
 *       - Data Service API
 *     produces:
 *       - application/json    
 *     parameters:
 *      - in: path
 *        name: userId
 *        required: true
 *        schema:
 *          type: number
 *     description: get all templates belong to a user
 *     responses:
 *       200:
 *         description: Returns all the templates
 *       500:
 *         description: Something went wrong on Server
 */
router.get('/:userId/getAllTemplates', async (req, res) => {
    try {
        const userId = req.params?.userId;
        const user = await moldCostModel.find({ "userId": userId });
        if (_.isEmpty(user)) {
            const defaultTemplateCollection = db.collection("defaultTemplate");
            const doc = await defaultTemplateCollection.find({}).toArray();
            const moldCost = new moldCostModel({
                userId,
                templates: doc
            })
            await moldCost.save();
            res.status(200).json(moldCost);
            return;
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 *
 * /saveTemplate:
 *   post:
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  userId:
 *                    type: number
 *                  saveTemplate:
 *                    type: object
 *               required:
 *                  - userId
 *                  - saveTemplate
 *     summary: Save modified template as new template in database
 *     description: Save modified template as new template in database
 *     tags:
 *       - Data Service API
 *     responses:
 *       200:
 *         description: Save template successfully.
 *       500:
 *         description: Something went wrong on server
 */
router.post('/saveTemplate', async (req, res) => {
    try {
        const userId = req.body?.userId;
        const newTemplate = req.body?.saveTemplate;

        moldCostModel.findOneAndUpdate(
            { userId },
            { $push: { templates: { ...newTemplate, _id: new mongoose.Types.ObjectId() } } },
            { new: true, upsert: true },
            function (error, success) {
                if (error) {
                    res.status(500).json(error);
                } else {
                    // res.status(200).json(success);
                    res.status(200).json("save template successfully");
                }
            },
        )
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /{userId}/getTemplate/?templateName={templateName}:
 *   get:
 *     summary: get template by userId and templateName
 *     tags:
 *       - Data Service API
 *     produces:
 *       - application/json   
 *     parameters:
 *      - in: path
 *        name: userId
 *        required: true
 *        schema:
 *          type: string
 *      - in: query
 *        name: templateName
 *        required: true
 *        schema:
 *          type: string
 *        description: The object ID.
 *     responses:
 *       200:
 *         description: Returns the requested template
 *       500:
 *         description: Something went wrong on server
 */
router.get('/:userId/getTemplate/', async (req, res) => {
    try {
        const userId = req.params?.userId;
        const templateName = req.query?.templateName;
        const result = await moldCostModel.findOne(
            { userId }
        ).select({
            _id: 0,
            templates: {
                $elemMatch: {
                    templateName,
                }
            }
        });
        if (_.isEmpty(result)) {
            res.status(400).json([]);
        } else {
            res.status(200).json(result);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})


module.exports = router;