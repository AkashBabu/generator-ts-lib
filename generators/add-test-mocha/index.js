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

    this.fs.extendJSON(this.destinationPath("package.json"), {
      scripts: {
        _test:
          "cross-env TS_NODE_FILES=true mocha --require ts-node/register test/**/*.spec.ts",
        "_test:exit": "npm run _test -- --exit",
        test: "cross-env NODE_ENV=test npm run _test:exit",
        "test:watch": "cross-env NODE_ENV=test npm run _test -- -w",
        "test:grep": "cross-env NODE_ENV=test npm run _test -- -g ",
        coverage: "nyc npm run test"
      },
      nyc: {
        extension: [".ts"],
        exclude: ["**/*.d.ts"],
        include: ["src/**/*"]
      },
      devDependencies: {
        "@types/chai": "^4.2.3",
        "@types/mocha": "^5.2.7",
        "@types/node": "^12.7.12",
        chai: "^4.1.2",
        "cli-progress": "^3.3.1",
        delay: "^4.3.0",
        mocha: "^5.2.0",
        nyc: "^12.0.2",
        "ts-node": "^8.0.2"
      }
    });

    mkdirp("test/");

    this.config.set("test", "true");
    this.config.set("test:type", "mocha");
  }

  install() {
    this.installDependencies({
      npm: true,
      bower: false
    });
  }
};
