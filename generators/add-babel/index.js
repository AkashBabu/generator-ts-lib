const Generator = require("yeoman-generator");

module.exports = class extends Generator {
  writing() {
    this.fs.copy(
      this.templatePath(".babelrc.js"),
      this.destinationPath(".babelrc.js")
    );

    this.fs.extendJSON(this.destinationPath("package.json"), {
      devDependencies: {
        "@babel/core": "^7.7.2",
        "@babel/preset-env": "^7.7.1",
        "@babel/preset-typescript": "^7.7.2"
      }
    });
  }

  install() {
    this.installDependencies({
      npm: true,
      bower: false
    });
  }
};
