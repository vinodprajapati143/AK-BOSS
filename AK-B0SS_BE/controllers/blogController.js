const db = require("../config/db");
const dotenv = require('dotenv');
dotenv.config();

// ✅ Create Blog
exports.createBlog = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user?.id; 

    const image = req.file
    ? `${process.env.BASE_URL}/backend/api/uploads/${req.file.filename}`
    : '';

    const query = `
      INSERT INTO blogs (user_id, title, description, image)
      VALUES (?, ?, ?, ?)
    `;

      const [result] = await db.execute(query, [
      userId,
      title,
      description,
      image
    ]);

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