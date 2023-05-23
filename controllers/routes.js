// Import necessary modules
const express = require("express");
const blog = require("../api/blog.json");
const fs = require("fs");
const path = require("path");

// Create an Express router
const router = express.Router();

// COMPLETE: Endpoint that will display all comments from the database
router.get("/all", (req, res) => {
    // Read the data from blog.json
    fs.readFile(
        path.join(__dirname, "../api/blog.json"),
        "utf8",
        (err, data) => {
            if (err) {
                // Handle any errors that occurred during file reading
                console.error(err);
                res.status(500).json({ error: "Internal server error" });
                return;
            }

            // Parse the JSON data into an array of objects
            const posts = JSON.parse(data);

            // Send the posts as a response
            res.json(posts);
        }
    );
});

// COMPLETE: Endpoint that will display one comment from the database selected by its post_id:
router.get("/:post_id", (req, res) => {
    // find appropriate post
    const postId = blog.filter(
        (blog) => blog.post_id === parseInt(req.params.post_id)
    );

    // Read the database file
    fs.readFile(
        path.join(__dirname, "../api/blog.json"),
        "utf8",
        (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: "Failed to read the database." });
                return;
            }

            // Parse the database JSON
            const database = JSON.parse(data);

            // Find the post with the given post_id
            const post = database.find(
                (blog) => blog.post_id === parseInt(req.params.post_id)
            );

            // If the post exists, send it back to the user
            if (post) {
                res.json(post);
            } else {
                res.status(404).json({ error: "Post not found." });
            }
        }
    );
});

// COMPLETE: Endpoint that will allow us to create a new entry which will be appended to the blog.json file's outermost array.
router.post("/create", (req, res) => {
    // Read the database file
    fs.readFile(
        path.join(__dirname, "../api/blog.json"),
        "utf8",
        (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: "Failed to read the database." });
                return;
            }

            // Parse the JSON data into an array of objects
            const database = JSON.parse(data);

            // Generate a new post_id
            const newPostId = database.length + 1;

            // Create a new entry object
            const newEntry = {
                post_id: newPostId,
            };

            // Append the new entry to the database
            database.push(newEntry);

            // Write the updated database back to the file
            fs.writeFile(
                path.join(__dirname, "../api/blog.json"),
                JSON.stringify(database),
                "utf8",
                (err) => {
                    if (err) {
                        console.error(err);
                        res.status(500).json({
                            error: "Failed to write to the database.",
                        });
                        return;
                    }

                    // Send the new entry as a response
                    res.json(newEntry);
                }
            );
        }
    );
});

// COMPLETE: Endpoint that will allow us to update an existing entry once a match has been found
router.put("/", (req, res) => {
    // Read the database file
    fs.readFile(
        path.join(__dirname, "../api/blog.json"),
        "utf8",
        (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: "Failed to read the database." });
                return;
            }

            // Parse the JSON data into an array of objects
            let database = JSON.parse(data);

            // Find the index of the post to update based on the query parameter
            const postIndex = database.findIndex(
                (blog) => blog.post_id === parseInt(req.query.post_id)
            );

            // If the post exists, update it
            if (postIndex !== -1) {
                // Update the post with the data from the request body
                database[postIndex] = { ...database[postIndex], ...req.body };

                console.log(req.body);

                // Write the updated database back to the file
                fs.writeFile(
                    path.join(__dirname, "../api/blog.json"),
                    JSON.stringify(database),
                    "utf8",
                    (err) => {
                        if (err) {
                            console.error(err);
                            res.status(500).json({
                                error: "Failed to write to the database.",
                            });
                            return;
                        }

                        // Send the updated post as a response
                        res.json({
                            message: `Post has been updated.`,
                        });
                    }
                );
            } else {
                res.status(404).json({ error: "Post not found." });
            }
        }
    );
});


// COMPLETE: Endpoint that will allow us to delete an entry from the database
router.delete("/:post_id", (req, res) => {
    // Read the database file
    fs.readFile(
        path.join(__dirname, "../api/blog.json"),
        "utf8",
        (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: "Failed to read the database." });
                return;
            }

            // Parse the JSON data into an array of objects
            const database = JSON.parse(data);

            // Get the post_id from the URL parameter
            const postId = parseInt(req.params.post_id);

            // Find the index of the post with the given post_id
            const postIndex = database.findIndex(
                (blog) => blog.post_id === postId
            );

            // If the post doesn't exist, return an error
            if (postIndex === -1) {
                res.status(404).json({ error: "Post not found." });
                return;
            }

            // Remove the post from the database
            const deleted = database.splice(postIndex, 1)[0];

            // Write the updated database back to the file
            fs.writeFile(
                path.join(__dirname, "../api/blog.json"),
                JSON.stringify(database),
                "utf8",
                (err) => {
                    if (err) {
                        console.error(err);
                        res.status(500).json({
                            error: "Failed to write to the database.",
                        });
                        return;
                    }

                    // Send the deleted post as a response
                    res.json({
                        message: `The post with post_id ${postId} has been deleted.`,
                        recordsDeleted: deleted,
                    });
                }
            );
        }
    );
});

// Export the router
module.exports = router;
