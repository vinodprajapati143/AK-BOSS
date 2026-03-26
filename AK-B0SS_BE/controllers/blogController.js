const db = require('../db');

// ✅ Create Blog
exports.createBlog = async (req, res) => {
  try {
    const { title, description } = req.body;

    const image = req.file
    ? `${BASE_URL}/uploads/${req.file.filename}`
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