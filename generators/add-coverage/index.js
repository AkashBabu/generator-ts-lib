const Generator = require("yeoman-generator");

module.exports = class extends Generator {
  initializing() {
    this.props = {};
  }

  async prompting() {
    this.props = await this.prompt([
      {
        type: "input",
        name: "token",
        message:
          "Please enter coveralls token obtained from https://coveralls.io/repos"
      }
    ]);
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath(".coveralls.yml"),
      this.destinationPath(".coveralls.yml"),
      this.props
    );

    this.fs.extendJSON(this.destinationPath("package.json"), {
      scripts: {
        coveralls:
          "npm run coverage && nyc report --reporter=text-lcov | coveralls"
      }
    });
  }

  install() {
    this.npmInstall(["coveralls"], { "save-dev": true });
  }
};
