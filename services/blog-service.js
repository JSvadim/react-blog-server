import pool from "../config/db.js";

class BlogService {
    async getBlog(id) {
        const sqlQuery = `SELECT * FROM blog WHERE id_blog = ${id}`
        const blog = await pool.query(sqlQuery);
        return blog[0][0];
    }
    async get100Blogs(multiplier) {}
    async addBlog(blogData) {
        console.log(blogData)
        const { title, text, userId, date, imagesNames } = blogData;
        const imagesNamesForDB = [];
        for (let i = 0; i < 5; i++) {
            imagesNamesForDB.push(imagesNames[i] !== undefined ? imagesNames[i] : '');
        }
        const sqlQuery = `
        INSERT INTO 
            blog (
                id_blog, 
                title, 
                text, 
                date, 
                pic_1, 
                pic_2, 
                pic_3, 
                pic_4, 
                pic_5, 
                id_user
            ) 
            VALUES (
                NULL, '${title}', '${text}', 
                '${date}', 
                '${imagesNamesForDB[0]}', 
                '${imagesNamesForDB[1]}', 
                '${imagesNamesForDB[2]}', 
                '${imagesNamesForDB[3]}', 
                '${imagesNamesForDB[4]}', 
                '${userId}'
            );
            SELECT LAST_INSERT_ID();
        `
        const addedBlogId = (await pool.query(sqlQuery))[0][0].insertId;
        const addedBlog = (await this.getBlog(addedBlogId));
        return addedBlog
    }
    async deleteBlogById(id) {}
}

export default new BlogService();