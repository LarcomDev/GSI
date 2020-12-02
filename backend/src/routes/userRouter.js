const express = require('express');
const User = require('../models/user');
const userRouter = express.Router();

module.exports = () => {

	userRouter.route("/blockToggle/:userToBlockId")
	.put((req, res) => {
		// Header contains UserID named Blocker and another UserID named Blockee
		User.findById(req.params.userToBlockId, (err, userToBlock) => {
			userToBlock.profile.blockedBy[userToBlock.profile.blockedBy.length] = currentUser.id;
			userToBlock.save((err, utb) => {
				if (err) return console.error(err);
				console.log(userToBlock.username + " followed.");
			});
		});
		User.findByUsername(req.user.username, (err, currentUser) => {
			currentUser.profile.blockedUsers[currentUser.profile.blockedUsers.length] = userToBlock.id;
			currentUser.save((err, cu) => {
				if (err) return console.error(err);
			});
		});
	});

	userRouter.route("/followToggle/:userToFollowId")
	.put((req, res) => {
		User.findById(req.params.userToFollowId, (err, userToFollow) => {
			if (err) return console.error(err);
			userToFollow.profile.followedBy[userToFollow.profile.followedBy.length] = currentUser.id;
			userToFollow.save((err, utf) => {
				if (err) return console.error(err);
				console.log(userToFollow.username + " followed.");
			});
		});
		User.findByUsername(req.user.username, (err, currentUser) => {
			if (err) return console.error(err);
			currentUser.profile.followedUsers[currentUser.profile.followedUsers.length] = userToFollow.id;
			currentUser.save((err, cu) => {
				if (err) return console.error(err);
			});
		});
	});

	userRouter.route("/following/:userId")
	.get((req, res) => {
	});

	userRouter.route("/:userId")
	.get((req, res) => {
        User.findById(req.params.userId, (err, usr) => {
            if(err) {
                res.sendStatus(500);
            } else {
                res.send(usr);
            }
        });
	})
	.put((req, res) => {
        const usr = req.body.user;
        User.updateOne({_id: req.params.userId}, {profile: {...usr}}, {upsert: true}, (err, doc) => {
            if(err) {
                res.sendStatus(500);
            } else {
                res.sendStatus(200);
            }
        });
		// Body contains JSON object with a User object 
	})
	.delete((req, res) => {
		// Deletes the user from the database with the path param id and redirects to log in page.
		User.findByIdAndDelete(
			{ '_id': req.params.userId },
			(err, user) => {
				if (err) res.sendStatus(500);
				console.log(user.username + ' deleted');
			});
    });
    
	userRouter.route("/logout")
	.get((req, res) => {
		// logs user out and redirects the page to the sign in page 
	});

	return userRouter;
}