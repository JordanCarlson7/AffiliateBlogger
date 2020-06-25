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


--Insert Users
INSERT INTO users (user_name, password, email, url_extension) VALUES ('test_user', 'test_password', 'test@email.com', 'test/route/extension');