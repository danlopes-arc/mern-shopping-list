const router = require('express').Router()
const { delay } = require('../../helpers/helpers')
const auth = require('../../middleware/auth')

const Item = require('../../models/Item')

router.route('/')
    .get(async (req, res) => {
        try {
            const items = await Item.find()
                .sort({date: -1})

            return res.json(items)
            
        } catch (err) {
            console.log(err)
            return res.sendStatus(500)
        }
    })

    .post(auth, async (req, res) => {
        try {
            const newItem = await new Item({
                name: req.body.name
            }).save()

            return res.json(newItem)
            
        } catch (err) {
            console.log(err)
            return res.sendStatus(500)
        }
    })

router.route('/:id')
    .delete(auth, async (req, res) => {
        try {
            const item = await Item.findById(req.params.id)
            
            if (item == null) return res.sendStatus(404)

            await item.remove()
            return res.json({_id: req.params.id})

        } catch (err) {
            console.error(err);
            return res.sendStatus(500)
        }
    })

module.exports = router