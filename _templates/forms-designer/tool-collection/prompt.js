// see types of prompts:
// https://github.com/enquirer/enquirer/tree/master/examples
//
module.exports = [
  {
    type: "input",
    name: "name",
    message: "Name of the tool collection package",
    initial: "@formswizard/",
  },
  {
    type: "input", 
    name: "description",
    message: "Description of the tool collection",
    initial: "A collection of form components and renderers",
  },
];
