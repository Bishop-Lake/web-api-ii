const express = require('express');

const Posts = require('./data/db.js');

const server = express();

server.use(express.json())

server.post('/api/posts', (request, response) => {
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

server.post('/api/posts/:id/comments', (req, res) => {
    const comment = {...req.body, post_id: req.params.id}

    Posts.findById(req.params.id)
        .then(post => {
            if (post.length == 0) {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            } else {
                res.send('hello')
            }
        })

})

const port = 8000

server.listen(port, () => console.log(`\n Server listening on port ${port} \n`))