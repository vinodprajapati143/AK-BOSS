const db = require("../config/db");
const dotenv = require('dotenv');
const sanitizeHtml = require('sanitize-html');
const slugify = require('slugify');

dotenv.config();

exports.createBlog = async (req, res) => {
  try {
    const { title, description, subDescription } = req.body;
    const userId = req.user?.id;

    // 🔐 Auth check
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized user' });
    }

    // 🛑 Validation
    if (!title || !description) {
      return res.status(400).json({
        message: 'Title and description are required'
      });
    }

    // 🧼 Sanitize HTML (XSS protection)
    const cleanDescription = sanitizeHtml(description);
    const cleanSubDescription = subDescription
      ? sanitizeHtml(subDescription)
      : null;

    // 🖼️ Image validation
    if (req.file && !req.file.mimetype.startsWith('image')) {
      return res.status(400).json({
        message: 'Only image files are allowed'
      });
    }

    const image = req.file
      ? `${process.env.BASE_URL}/backend/api/uploads/${req.file.filename}`
      : null;

    // 🔗 Slug generate
    let slug = slugify(title, { lower: true, strict: true });

    // 🔁 Ensure unique slug
    const [existingSlug] = await db.execute(
      'SELECT id FROM blogs WHERE slug = ?',
      [slug]
    );

    if (existingSlug.length > 0) {
      slug = `${slug}-${Date.now()}`;
    }

    // 🔁 Duplicate title check (optional but good)
    const [existingTitle] = await db.execute(
      'SELECT id FROM blogs WHERE title = ?',
      [title]
    );

    if (existingTitle.length > 0) {
      return res.status(400).json({
        message: 'Blog with this title already exists'
      });
    }

    // 🧾 Insert query
    const query = `
      INSERT INTO blogs (user_id, title, description, subDescription, image, slug)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(query, [
      userId,
      title,
      cleanDescription,
      cleanSubDescription,
      image,
      slug
    ]);

    return res.status(201).json({
      message: 'Blog created successfully',
      blogId: result.insertId,
      slug
    });

  } catch (error) {
    console.error('Create Blog Error:', error);

    return res.status(500).json({
      message: 'Internal Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};