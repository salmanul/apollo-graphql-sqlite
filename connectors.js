const Sequelize = require('sequelize');
const casual = require('casual');
const _ = require('lodash');

const db = new Sequelize('blog', null, null, {
    dialect: 'sqlite',
    storage: './blog.sqlite',
});

const BookModel = db.define('book', {
    title: { type: Sequelize.STRING },
    author: { type: Sequelize.STRING },
});

const UserModel = db.define('user', {
    name: { type: Sequelize.STRING }
});

UserModel.hasMany(BookModel);
BookModel.belongsTo(UserModel);

// create mock data with a seed, so we always get the same
casual.seed(123);
db.sync({ force: true }).then(() => {
    _.times(10, () => {
        return UserModel.create({
            name: casual.username
        }).then((user) => {
            return user.createBook({
                title: `Author by ${user.name}`,
                author: casual.name
            });
        });
    });
});

const User = db.models.user;
const Book = db.models.book;

module.exports = { User, Book };