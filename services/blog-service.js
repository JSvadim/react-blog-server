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
        const imagesNamesForDB = [];
        if(imagesNames.length > 0) {
            for (let i = 0; i < 5; i++) {
                imagesNamesForDB.push(imagesNames[i] ? imagesNames[i] : null);
            }
        }
        const sqlQuery = `
        INSERT INTO 
            blog (
                id_blog, title, text, date, id_user,
                pic_1, pic_2, pic_3, pic_4, pic_5
            ) 
            VALUES (
                NULL, ?, ?, ?, ?,
                ?, ?, ?, ?, ?
            );
            SELECT LAST_INSERT_ID();
        `
        const params = [title, text, date, userId, ...imagesNamesForDB];
        const addedBlogId = (await pool.query(sqlQuery, params))[0][0].insertId;
        const addedBlog = (await this.getBlog(addedBlogId));
        return addedBlog
    }
    async deleteBlogById(id) {}
}

export default new BlogService();