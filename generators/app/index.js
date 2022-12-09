const fs = require('fs');
const path = require('path');
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const cowsay = require('cowsay');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.argument('appname', { type: String, required: false  });
    this.spawnOpts = { stdio: [process.stdin, 'ignore', 'ignore']  };
    this.props = {};
  }
  async prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the outstanding ${chalk.red('koa-esm-api')} generator!`
      )
    );

    if (!this.options.appname) {
      this.props.appname = await this.prompt([
        {
          type: 'input',
          name: 'appname',
          message: 'name it...',
          default: path.basename(process.cwd()),
        }
      ]).then(res => res.appname);
    }
    else {
      this.props.appname = this.options.appname;
    }
    this.log(chalk.blue('[*] creating app...'));
    if (path.basename(this.destinationPath()) !== this.props.appname) {
      if (fs.existsSync(path.join(process.cwd(), this.props.appname))) {
        this.log(chalk.red('[!] error, target dir already exists'));
        process.exit(1);//TODO not the best way of shutting down
      }
      this.destinationRoot(this.destinationPath(this.props.appname));
    }
    else {
      this.destinationRoot('.');
    }

    this.log(this.props.appname);
  }

  writing() {
    this.log(chalk.red('[*] writing...'));
    this.sourceRoot(path.join(__dirname, 'templates'));
    this.fs.copyTpl(this.templatePath('.'), this.destinationPath('.'), this);
    this.fs.copyTpl(this.templatePath('./.*'), this.destinationRoot(), this);
    this.fs.copyTpl(this.templatePath('./.husky'), this.destinationPath('./.husky'), this);
    [
      `PORT=3001`,
      `PROJECT_NAME='${this.props.appname}'`,
      `MONGODB_URI_DEV=mongodb://localhost:27017/$PROJECT_NAME`,
      `MONGODB_URI='e.g. mongodb+srv://user:password@cluster2.22wau.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'`,
      ``,
      `EMAIL_HOST=''`,
      `EMAIL_USER=''`,
      `EMAIL_PASS=''`,
      `EMAIL_FROM=''`,
      ``,
    ].map(envVar => {
      this.fs.append(this.destinationPath('.env'), envVar + '\n', { create: true });
    });
    this.config.set({ v: 42 });
    this.config.save();
  }

  install() {
    this.log(chalk.green('[*] installing...'));
    this.spawnCommandSync('npm', ['install'], this.spawnOpts);
  }

  end() {
    this.log(
      cowsay.think({ text: `${chalk.red('done @_@')}`  })
    );
  }
};
