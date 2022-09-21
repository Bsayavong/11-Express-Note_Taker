// exports a function that makes a string of random numbers and letters to use for the ID
module.exports = () =>
  Math.floor((1 + Math.random()) * 0x10000)
  .toString(16)
  .substring(1);