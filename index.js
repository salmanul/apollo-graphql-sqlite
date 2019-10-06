const { ApolloServer, gql } = require('apollo-server');
const {User,Book} = require('./connectors');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    id: ID!
    title: String
    author: String
    createdAt: String
    updatedAt: String
    user:User
  }
  type User{
    id: ID!
    name: String
    createdAt: String
    updatedAt: String
    books: [Book]
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    getAllBooks: [Book]
    getAllUsers: [User]
  }
`;
const books = [
    {
      title: 'Harry Potter and the Chamber of Secrets',
      author: 'J.K. Rowling',
      currentUser:{
          name:'salman',
      }
    },
    {
      title: 'Jurassic Park',
      author: 'Michael Crichton',
      currentUser:null
    },
  ];

  // Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
      getAllBooks: () => Book.findAll().then(books=>books),
      getAllUsers: () => User.findAll({include:[Book]}).then(users=>users),
    },
  };
  // The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});