--Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    user_name varchar(80) NOT NULL UNIQUE,
    password varchar(255) NOT NULL,
    email varchar(80),
    url_extension varchar(255)
);
--Blogs
CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    user_id int REFERENCES users(id),
    title varchar(255),
    subject varchar(255),
    date Date,
    content text
);
--Comments
CREATE TABLE comments (
    id SERIAL,
    blog_id int REFERENCES blogs(id),
    author varchar(255),
    content text,
    date Date
);
--Affiliates
CREATE TABLE affiliates (
    user_id int REFERENCES users(id),
    company varchar(255),
    hyperlink text
);
--Attachments
CREATE TABLE attachments (
    blog_id int REFERENCES blogs(id),
    file_path text
);

--LocalAccess
CREATE USER localTester WITH PASSWORD 'localpassword';
GRANT SELECT, INSERT, UPDATE, DELETE ON users, blogs, affiliates, attachments TO localTester;
GRANT USAGE, SELECT ON SEQUENCE users_id_seq, blogs_id_seq TO localTester;

--TESTING--
--Inserts
--Insert Users
INSERT INTO users (user_name, password, email, url_extension) VALUES ('test_user', 'test_password', 'test@email.com', 'test/route/extension');
--Insert Blogs
INSERT INTO blogs (user_id, title, subject, date, content) VALUES (1, 'test_title', 'test_subject', '2020-10-10', 'test_content_Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dolor sed viverra ipsum nunc aliquet bibendum enim. Diam ut venenatis tellus in metus. Lacus vel facilisis volutpat est velit egestas. Consectetur adipiscing elit ut aliquam purus sit amet luctus venenatis. Condimentum lacinia quis vel eros donec. Amet aliquam id diam maecenas ultricies. Arcu odio ut sem nulla. Tellus elementum sagittis vitae et leo duis ut diam quam. Risus ultricies tristique nulla aliquet enim tortor at auctor urna. Amet nisl purus in mollis nunc. Ultricies integer quis auctor elit sed. Diam maecenas ultricies mi eget mauris pharetra. In nisl nisi scelerisque eu ultrices vitae auctor eu augue. Sit amet mauris commodo quis imperdiet massa tincidunt. Imperdiet dui accumsan sit amet nulla facilisi. Vitae semper quis lectus nulla at volutpat diam ut. Nisl condimentum id venenatis a. Urna nec tincidunt praesent semper feugiat nibh sed.
 fringilla ut morbi tincidunt augue interdum. Vestibulum lectus mauris ultrices eros in. Tristique senectus et netus et malesuada fames. Dignissim cras tincidunt lobortis feugiat. Urna cursus eget nunc scelerisque viverra mauris in aliquam. Libero enim sed faucibus turpis in eu. Velit laoreet id donec ultrices tincidunt arcu non. Porttitor rhoncus dolor purus non enim. Vitae aliquet nec ullamcorper sit amet risus nullam eget felis. Netus et malesuada fames ac turpis egestas integer eget aliquet. Maecenas pharetra convallis posuere morbi leo urna molestie at. Eu sem integer vitae justo eget magna fermentum. Blandit turpis cursus in hac habitasse platea dictumst. Elementum nibh tellus molestie nunc non blandit. Consequat semper viverra nam libero justo laoreet sit. Vulputate sapien nec sagittis aliquam malesuada. Nibh cras pulvinar mattis nunc sed blandit libero. Eu sem integer vitae justo eget.'
);
--Insert Comments
INSERT INTO comments (blog_id, author, content, date) VALUES (1, 'theCommentor', 'Here is my comment, blah blah blah', '2020-2-2');

--Insert Affiliates
INSERT INTO affiliates (user_id, company, hyperlink) VALUES ('1', 'GoPro', 'https://gopro.com/en/us/');
INSERT INTO affiliates (user_id, company, hyperlink) VALUES ('1', 'Heroku PHP', 'https://aqueous-savannah-82826.herokuapp.com/');
--Insert attachments
INSERT INTO attachments (blog_id, file_path) VALUES ('1', '../attachments/test_attachmnet');


--GETTING--
--author and blog
SELECT * FROM blogs JOIN users ON blogs.user_id = users.id;

--triple join: blogs, users, comments
SELECT * FROM blogs JOIN users ON blogs.user_id = users.id JOIN comments on blogs.id = comments.blog_id;

SELECT * FROM blogs JOIN users ON blogs.user_id = 1 AND blogs.user_id = users.id JOIN comments on blogs.id = comments.blog_id;

--comments
SELECT author, content, date FROM comments WHERE comments.blog_id = //desired blog_id;

--DELETING
DELETE from comments WHERE comments.content = 'l';//desired comment;