const router = require("express").Router()
const db = require("../api/blog.json")
const fs = require("fs")

router
    .route("/")
    .get((_, res) => {
        res.status(200).json(db)
    })
    .post((req, res) => {
        let post = req.body

        try {
            fs.readFile("api/blog.json", (err, data) => {
                if (err) throw err
                const db = JSON.parse(data)
                db.push(post)
                fs.writeFile("api/blog.json", JSON.stringify(db), () => null)
            })
    
            res.status(201).json({
                message: "Entry created",
                post
            })
        } catch (err) {
            console.error(err)
            res.status(500).json({
                message: `Error: ${err}`
            })
        }
    })

router
    .route("/:id")
    .put((req, res) => {
        let id = Number(req.params.id)
        let post = req.body

        try {
            fs.readFile("api/blog.json", (err, data) => {
                if (err) throw err
                const db = JSON.parse(data)
                db.forEach((e, i) => {
                    if (e.post_id == id) {
                        db[i] = post
                        fs.writeFile("api/blog.json", JSON.stringify(db), () => null)
                        
                        res.status(200).json({
                            message: `ID: ${id} modified`,
                            object: db[i]
                        })
                    } else {
                        res.status(404).json({
                            message: `ID: ${id} not found.`
                        })
                    }
                })
            })
        } catch (err) {
            res.status(500).json({
                message: `Error: ${err}`
            })
        }
    })
    .delete((req, res) => {
        let id = Number(req.params.id)

        try {
            fs.readFile("api/blog.json", (err, data) => {
                if (err) throw err
                const db = JSON.parse(data)
                let filteredDb = db.filter((e, i) => {
                    if (e.post_id !== id) {
                        return e
                    }
                })
                fs.writeFile("api/blog.json", JSON.stringify(filteredDb), () => null)
                res.status(200).json({
                    message: `ID: ${id} successfully deleted`
                })
            })
        } catch (err) {
            res.status(500).json({
                message: `Error: ${err}`
            })
        }
    })

module.exports = router