const Generator = require("yeoman-generator");

module.exports = class extends Generator {
  writing() {
    const precommit = ["lint:fix", "lint", "build", "status"];

    if (this.config.get("test")) {
      precommit.unshift("coverage");
    }

    this.fs.extendJSON(this.destinationPath("package.json"), { precommit });

    this.config.set("precommit", true);
  }

  install() {
    this.npmInstall("pre-commit", { "save-dev": true });
  }
};
