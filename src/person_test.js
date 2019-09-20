const Person = require('./person');
const fn = require('./functionTest');
const p1 = new Person('Bill', 25);
const p2 = new Person;
console.log(p1.toJSON());
console.log(p2.toJSON());
console.log(fn(3));
