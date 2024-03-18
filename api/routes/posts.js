const express = require('express')
const router = express.Router()

const { addPost,
    getPost,
    getPosts,
    deletePost,
    updatePosts } = require('./../controllers/post')

router.get('/', getPosts)
router.get('/:id', getPost)
router.post('/', addPost)
router.delete('/:id', deletePost)
router.put('/:id', updatePosts)

module.exports = {
    router
}