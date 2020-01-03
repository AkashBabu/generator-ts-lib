const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const changeCase = require("change-case");
const glob = require("glob");
const mkdirp = require("mkdirp");
const path = require("path");

module.exports = class extends Generator {
  initializing() {
    this.log(yosay(`Welcome to ${chalk.red("generator-ts-lib")} generator!`));

    this.answers = {
      git: {},
      npm: {},
      others: {}
    };

    this.option("skipInstall", {
      alias: "s",
      default: false,
      description: "Skips dependencies installation step",
      type: Boolean
    });
  }

  async prompting() {
    this.answers.git = await this.prompt([
      {
        type: "input",
        name: "username",
        message: "Please enter your github username",
        store: true
      },
      {
        type: "input",
        name: "useremail",
        message: "Please enter your github email",
        store: true
      },
      {
        type: "input",
        name: "libName",
        message: "Please enter your github repo name",
        default: this.determineAppname()
      }
    ]);

    this.answers.npm = await this.prompt([
      {
        type: "input",
        name: "libName",
        message: "Please enter your npmjs.org namespace",
        default: this.answers.git.libName
      },
      {
        type: "input",
        name: "description",
        message: "Please enter description for your project"
      },
      {
        type: "input",
        name: "keywords",
        message: "Please enter comma separated keywords",
        filter(words) {
          return words.split(",").map(s => s.trim());
        }
      }
    ]);

    this.answers.others = await this.prompt([
      {
        type: "input",
        name: "className",
        message: "Please enter the entry className of your project",
        default: changeCase.pascalCase(this.answers.git.libName)
      }
    ]);
  }

  configuring() {}

  default() {
    if (path.basename(this.destinationPath()) !== this.answers.git.libName) {
      this.log(
        `Your generator must be inside a folder named ${this.answers.git.libName}\nI'll automatically create this folder.`
      );
      mkdirp(this.answers.git.libName);
      this.destinationRoot(this.destinationPath(this.answers.git.libName));
    }
  }

  writing() {
    this.fs.copyTpl(
      glob.sync(this.templatePath("**/*")),
      this.destinationPath(),
      this.answers
    );

    this.fs.copyTpl(
      this.templatePath(".*"),
      this.destinationPath(),
      this.answers
    );

    const pkg = this.fs.readJSON(this.destinationPath("package.json"));
    this.fs.extendJSON(this.destinationPath("package.json"), {
      keywords: (pkg.keywords || []).concat(this.answers.npm.keywords)
    });
  }

  conflicts() {}

  install() {
    this.npmInstall(["covgen"], { "save-dev": true });

    if (!this.options.skipInstall) {
      this.installDependencies({
        npm: true,
        bower: false
      });
    }

    this.spawnCommand("covgen", [this.answers.git.useremail]);
  }

  end() {}
};

/**
 * Prompting
 *
 * git.username
 * {git.useremail}
 * (git.libName)
 * (npm.libName)
 * (description)
 * (keywords - comma separated)
 * (className)
 * {coverallsToken}
 *  npm script
 *  add this stage for pre-commit hook
 *  create a file with the given token as repo_token
 *
 * would you like to generate code-of-conduct ?
 */

/**
 * Feature
 * rename entry file
 * generate test file
 * covgen needed
 */

/**
 * installations
 * Would
 * npm install -g covgen
 * run covgen
 */
