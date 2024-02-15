var express = require("express")
var { graphqlHTTP } = require("express-graphql")
var { buildSchema } = require("graphql")
var cors = require("cors");

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`

  input MessageInput {
    content: String
    author: String
  }

  type Message {
    id: ID!
    content: String
    author: String
  }

  type Mutation {
    createMessage(input: MessageInput): Message
    updateMessage(id: ID!, input: MessageInput): Message
  }

  type Query {
    getMessage(id: ID!): Message
    quoteOfTheDay: String
    random: Float!
    rollThreeDice: [Int]
    rollDice(numDice: Int!, numSides: Int): [Int]
  }
`)

// If Message had any complex fields, we'd put them on this object.
class Message {
  constructor(id, { content, author }) {
    this.id = id
    this.content = content
    this.author = author
  }
}

// The root provides a resolver function for each API endpoint
var fakeDatabase = {}
var root = {
  createMessage: ({ input }) => {
    // Create a random id for our "database".
    var id = require("crypto").randomBytes(10).toString("hex")

    fakeDatabase[id] = input
    return new Message(id, input)
  },
  updateMessage: ({ id, input }) => {
    if (!fakeDatabase[id]) {
      throw new Error("no message exists with id " + id)
    }
    // This replaces all old data, but some apps might want partial update.
    fakeDatabase[id] = input
    return new Message(id, input)
  },
  getMessage: ({ id }) => {
    if (!fakeDatabase[id]) {
      throw new Error("no message exists with id " + id)
    }
    return new Message(id, fakeDatabase[id])
  },
  quoteOfTheDay: () => {
    return Math.random() < 0.5 ? "Take it easy" : "Salvation lies within"
  },
  random: () => {
    return Math.random()
  },
  rollThreeDice: () => {
    return [1, 2, 3].map(_ => 1 + Math.floor(Math.random() * 6))
  },
  rollDice: args => {
    var output = []
    for (var i = 0; i < args.numDice; i++) {
      output.push(1 + Math.floor(Math.random() * (args.numSides || 6)))
    }
    return output
  },
  ip: function (args, request) {
    return request.ip
  },
}

const loggingMiddleware = (req, res, next) => {
    console.log("ip:", req.ip)
    next()
}

var app = express()
app.use(loggingMiddleware)
app.use(cors());
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
)
app.listen(4000)
console.log("Running a GraphQL API server at localhost:4000/graphql")