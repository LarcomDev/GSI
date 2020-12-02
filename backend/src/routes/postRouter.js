const express = require('express');
const postRouter = express.Router();
const User = require("../models/user");
const Post = require("../models/post");

module.exports = () => {

	postRouter.route("/")
	.get((req, res) => {
		Post.find((err, posts) => {
			res.send(posts);
		});
	})
	.post((req, res) => {
		let post = new Post({
			user: req.user._id,
			username: req.user.username,
			text: req.body.text,
			date: Date.now(),
			likeCount: 0,
			comments: []
		});
		post.save((err, post) => {
			if (err) return console.error(err);
			console.log("Post added");
			User.findById(req.user._id, (err, user) => {
				user.authoredPosts.push(post._id);
				user.save((err, user) => {
					if (err) return console.error(err);
				})
			})
			res.json(post);
			// res.redirect(`/post/${post.id}`)
		});
    });
    postRouter.route("/followedPosts")
    .get((req, res) => {
        console.log("Hello!");
        console.log(req.user);
        User.findById(req.user._id, (err, users) => {
            if (err) console.log(err)

            const followedUsers = users.profile.followedUsers;

            const posts = Post.find({ user: { $in: followedUsers } })
            posts.sort({ date: -1 })
            posts.exec(function (error, allPosts) {
                if (error) console.log(error)
                res.json(allPosts)
            })
        })
    });

	postRouter.route("/editPost/:postId")
		.get((req, res) => {
		});

	postRouter.route("/likeToggle/:postId")
		.patch((req, res) => {
			// update post object numLike and user who liked
			Post.findById(req.params.postId, (err, postToLike) => {
				postToLike.likeCount = postToLike.likeCount + 1;
				User.findById(req.user._id, (err, currentUser) => {
					currentUser.likedPosts[currentUser.likedPosts.length] = postToLike.id;
					currentUser.save((err, cu) => {
						if (err) return console.error(err);
						console.log(currentUser.username + " liked post " + postToLike.id);
					});
				});
	
				postToLike.save((err, ptl) => {
					if (err) return console.error(err);
				});
			});
		});

	postRouter.route("/comment/:postId")
		.patch((req, res) => {
			// add a comment on a post
			Post.findById(req.params.postId, (err, post) => {
				if(err) console.error(err);
				post.comments[post.comments.length] = {commentAuthor: req.user._id,	commentText: req.body.commentText, commentDate: Date.now()};
				post.save((err, post) => {
					if(err) console.error(err);
				})
			})
		});

	postRouter.route("/deleteCom/:postId")
		.patch((req, res) => {
			Post.findById(req.params.postId, (err, post) => {
				if(err) console.error(err);

				post.comments.splice(post.comments.findIndex(c => c._id = req.body.commentToDelete._id), 1);
				post.save((err, post) => {
					if(err) console.error(err);
				})
			})
		});

    postRouter.route("/:postId")
		.get((req, res) => {
			Post.findById(req.params.postId, (err, doc) => {
				if (err) {
					res.sendStatus(525);
				} else {
					res.send(doc);
				}
			})
		})
		.patch((req, res) => {
			// Edits a post with the post as the body
			Post.findById(req.params.postId, (err, post) => {
				post.text = req.body.text;
				post.save((err, post) => {
					if(err) console.error(err);
				})
			});
		})
		.delete((req, res) => {
			// Deletes a post with the matching PostID in the path
			Post.deleteOne({ _id: req.params.postId }, err => {
				if (err) {
					res.sendStatus(500);
				} else {
					res.sendStatus(200);
				}
			})
		});
	return postRouter;
}