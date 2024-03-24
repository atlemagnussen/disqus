// connect to shell
//  mongosh mongodb://localhost:27017
// commands:
// use disqus
// show collections

db["documentno"].createIndex( { message: "text" } )
