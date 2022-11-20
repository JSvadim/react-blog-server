import pool from "../config/db.js";

class BlogService {
    async getBlog(id) {
        const sqlQuery = `SELECT * FROM blog WHERE id_blog = ?`
        const blog = await pool.query(sqlQuery, id);
        return blog[0][0];
    }
    async getBlogs(id) {
        const sqlQuery = id ? 
            `SELECT * FROM blog WHERE id_user = ?` :
            `SELECT * FROM blog`;
        const blogs = await pool.query(sqlQuery, id);
        return blogs[0];
    }

    async addBlog(blogData) {
        const { title, text, userId, date, imagesNames } = blogData;
        const sqlQuery = `
        INSERT INTO 
            blog (
                id_blog, 
                title, 
                text, 
                date, 
                id_user,
                pictures
            ) 
            VALUES (
                NULL, 
                ?, 
                ?, 
                ?, 
                ?,
                ?
            );
            SELECT LAST_INSERT_ID();
        `
        const params = [title, text, date, userId, imagesNames || null];
        const addedBlogId = (await pool.query(sqlQuery, params))[0][0].insertId;
        const addedBlog = (await this.getBlog(addedBlogId));
        return addedBlog
    }
    async deleteBlogById(id) {}
}

export default new BlogService();