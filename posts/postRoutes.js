const express = require('express');

const router = express.Router();

const Posts = require('../data/db');

router.use(express.json())


router.post('/api/posts', (request, response) => {
    const {title, contents} = request.body;
    
    if (!title || !contents) {
        response
            .status(400)
            .json({errorMessage: 'Please provide both a title and contents for your post.'})
    } else {
        Posts.insert(request.body)
            .then(post => {
                response.status(201).json(post)
            })
            .catch(() => {
                response.status(500).json({
                    error: "There was an error while saving the post to the database"
                });
            })
    }
})

router.post('/api/posts/:id/comments', (req, res) => {
    const comment = {...req.body, post_id: req.params.id}

    Posts.findById(req.params.id)
        .then(post => {
            if (post.length == 0) {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            } else if (!comment.text) {
                res.status(400).json({ errorMessage: "Please provide text for the comment." })
            } else {
                Posts.insertComment(comment)
                    .then(() => {
                        res.status(201).json(comment)
                    })
                    .catch(() => {
                        res.status(500).json({ error: "There was an error while saving the comment to the database" })
                    })

            }
        })

})

router.get('/api/posts', (req, res) => {
    Posts.find()
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(() => {
            res.status(500).json({ error: "The posts information could not be retrieved." })
        })
})

router.get('/api/posts/:id', (req, res) => {
    Posts.findById(req.params.id)
        .then(post => {
            if (post.length == 0) {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            } else {
                res.status(200).json(post)
            }
        })
        .catch(() => {
            res.status(500).json({ error: "The post information could not be retrieved." })
        })
})

router.get('/api/posts/:id/comments', (req, res) => {
    Posts.findById(req.params.id)
        .then(post => {
            if (post.length == 0) {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            } else {
                Posts.findPostComments(req.params.id)
                    .then(posts => {
                        res.status(201).json(posts)
                    })
            }
        })
        .catch(() => {
            res.status(500).json({ error: "The comments information could not be retrieved." })
        })
})

router.delete('/api/posts/:id', (req, res) => {
    Posts.findById(req.params.id)
        .then(post => {
            if (post.length == 0) {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            } else {
                Posts.remove(req.params.id)
                    .then(() => {
                        res.status(200).json(post)
                    })
                .catch(() => {
                    res.status(500).json({ error: "The post could not be removed" })
                })
            }
        })
})

router.put('/api/posts/:id', (req, res) => {
    const {title, contents} = req.body
    
    Posts.findById(req.params.id)
        .then(post => {
            if (post.length == 0) {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            } else if (!title || !contents) {
                res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
            } else {
                Posts.update(req.params.id, req.body)
                    .then(() => {
                        Posts.findById(req.params.id)
                            .then(newPost => {
                                res.status(200).json(newPost)
                            })
                    })
                    .catch(() => {
                        res.status(500).json({ error: "The post information could not be modified." })
                    })
            }
        })
})

module.exports = router;