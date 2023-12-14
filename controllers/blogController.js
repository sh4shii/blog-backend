const asyncHandler = require("express-async-handler");
const Blog = require("../models/blogModel");

const getAllBlogs = asyncHandler(async (req, res, next) => {
  try {
    const blogs = await Blog.find({ user_id: req.user.id });

    if (!blogs) {
      return res.status(404).json({ error: "No Blogs Found" });
    }
    return res.status(200).json({ blogs });
  } catch (err) {
    console.log("Error fetching blogs:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

const getBlogById = asyncHandler(async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    return res.status(200).json({ blog });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const addBlog = asyncHandler(async (req, res, next) => {
  const { title, description, image } = req.body;
  if (!title || !description || !image) {
    return res.status(400).json({ error: "All fields are mandatory" });
  }

  try {
    const blog = await Blog.create({
      title,
      description,
      image,
      user_id: req.user.id,
    });
    // console.log("ok this is fine");
    if (blog) {
      console.log(`Blog created with title ${title}`);
      return res
        .status(201)
        .json({ _id: blog.id, title: blog.title, desc: blog.description });
    } else {
      return res.status(400).json({ message: "Blog data is not valid" });
    }
  } catch (err) {
    console.error("Error creating blog:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const updateBlog = asyncHandler(async (req, res, next) => {
  const blogId = req.params.id;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    if (blog.user_id.toString() !== req.user.id) {
      res.status(403).json({
        message: "You don't have the permission to update other user blogs",
      });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(blogId, req.body, {
      new: true,
    });
    res.status(200).json(updatedBlog);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

const deleteBlog = asyncHandler(async (req, res, next) => {
  const blogId = req.params.id;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    if (blog.user_id.toString() !== req.user.id) {
      res.status(403).json({
        message: "You don't have the permission to delete other user blogs",
      });
    }

    const result = await Blog.deleteOne({ _id: blogId });
    if (result) {
      return res.status(204).end();
    } else {
      return res.status(404).json({ success: false, error: "Blog not found" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = { getAllBlogs, addBlog, updateBlog, getBlogById, deleteBlog };
