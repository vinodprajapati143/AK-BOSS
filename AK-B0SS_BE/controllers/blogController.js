const db = require("../config/db");
const dotenv = require('dotenv');
dotenv.config();

// ✅ Create Blog
exports.createBlog = async (req, res) => {
  try {
    const { title, description } = req.body;

    const image = req.file
    ? `${process.env.BASE_URL}/backend/api/uploads/${req.file.filename}`
    : '';

    const query = `
      INSERT INTO blogs (title, description, image)
      VALUES (?, ?, ?)
    `;

    const [result] = await db.execute(query, [title, description, image]);

    res.status(201).json({
      message: 'Blog created successfully',
      blogId: result.insertId
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error creating blog',
      error: error.message
    });
  }
};