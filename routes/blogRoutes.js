const express = require("express");
const {
  getAllBlogs,
  addBlog,
  updateBlog,
  getBlogById,
  deleteBlog,
} = require("../controllers/blogController");
const validateTokenHandler = require("../middleware/validateTokenHandler");

const router = express.Router();

router.use(validateTokenHandler);

router.get("/", getAllBlogs);
router.get("/:id", getBlogById);
router.post("/add", addBlog);
router.put("/update/:id", updateBlog);
router.delete("/:id", deleteBlog);

module.exports = router;
