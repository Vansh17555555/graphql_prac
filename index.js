import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
// data
import db from './db.js';
// types
import { typeDefs } from './schema.js';
// resolvers
const resolvers = {
    Query: {
        games() {
            return db.games;
        },
        authors() {
            return db.authors;
        },
        reviews() {
            return db.reviews;
        },
        review(_, args) {
            console.log('Querying review with id:', args.id);
            const foundReview = db.reviews.find(review => review.id === args.id);
            console.log('Found review:', foundReview);
            return foundReview;
        },
        author(_, args) {
            console.log('Querying author with id:', args.id);
            const foundAuthor = db.authors.find(author => author.id === args.id);
            console.log('Found author:', foundAuthor);
            return foundAuthor;
        },
        game(_, args) {
            console.log('Querying game with id:', args.id);
            const foundGame = db.games.find(game => game.id === args.id);
            console.log('Found game:', foundGame);
            return foundGame;
        }
    },
    Game: {
        reviews(parent) {
            return db.reviews.filter((r) => r.game_id === parent.id);
        }
    },
    Author: {
        reviews(parent) { return db.reviews.filter((r) => r.author_id === parent.id); }
    },
    Review: {
        author(parent) {
            return db.authors.find((a) => a.id === parent.author_id);
        },
        game(parent) {
            return db.games.find((g) => g.id === parent.game_id);
        }
    },
    Mutation: {
        deleteGame(_, args) {
            db.games = db.games.filter((g) => g.id !== args.id);
            return db.games;
        },
        addGame(_, args) {
            let newGame = { ...args.game, id: Math.floor(Math.random() * 10000).toString() };
            db.games.push(newGame);
            return newGame;
        },
        updateGame(_, args) {
            db.games = db.games.map((g) => {
                if (g.id === args.id) {
                    return { ...g, ...args.edits };
                }
                return g;
            });
            return db.games.find((g) => g.id === args.id);
        }
    }
};
// server setup
const server = new ApolloServer({
    typeDefs,
    resolvers
});
const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 }
});
console.log(`Server ready at: ${url}`);
