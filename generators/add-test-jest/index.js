const Generator = require("yeoman-generator");
const mkdirp = require("mkdirp");

module.exports = class extends Generator {
  initializing() {
    if (this.config.get("test:type") === "mocha") {
      throw new Error("Seems like mocha testing has already been setup!");
    }
  }

  writing() {
    if (this.config.get("precommit")) {
      const pkg = this.fs.readJSON(this.destinationPath("package.json"));
      const precommit = ["coverage", ...pkg.precommit];

      this.fs.extendJSON(this.destinationPath("package.json"), {
        precommit
      });
    }

    this.fs.copy(this.templatePath("**/*"), this.destinationPath());

    this.fs.extendJSON(this.destinationPath("package.json"), {
      scripts: {
        test: "jest",
        "test:diff": "jest -o",
        "test:watch": "jest --verbose --watch",
        coverage: "jest --verbose --coverage"
      },
      devDependencies: {
        "@types/jest": "^24.0.23",
        "@types/react": "^16.9.16",
        "babel-jest": "24.1.0",
        "check-prop-types": "^1.1.2",
        delay: "^4.3.0",
        enzyme: "^3.10.0",
        "enzyme-adapter-react-16": "^1.15.1",
        "enzyme-to-json": "^3.4.3",
        jest: "24.1.0",
        jsdom: "^15.2.1",
        "prop-types": "^15.6.2"
      }
    });

    mkdirp("src/__tests__/");

    this.config.set("test", "true");
    this.config.set("test:type", "jest");
  }

  install() {
    this.installDependencies({
      npm: true,
      bower: false
    });
  }
};
