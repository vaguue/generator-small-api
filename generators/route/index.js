const fs = require('fs');
const path = require('path');
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const cowsay = require('cowsay');

const { capitalize, decapitalize, slug } = require('../../lib/str');
const { getAst, stringify, addRouter, addImport } = require('../../lib/ast');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.argument('name', { type: String, required: false  });
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

    if (!this.options.name) {
      this.props.name = await this.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'name it...',
          default: path.basename(process.cwd()),
        }
      ]).then(res => res.name);
    }
    else {
      this.props.name = this.options.name;
    }
    this.props.name = slug(this.props.name, { remove: undefined });
    this.props.codename = slug(this.props.name);
    this.sourceRoot(path.join(__dirname, 'templates'));
  }

  writing() {
    this.log(chalk.red('[*] writing...'));
    this.fs.copyTpl(this.templatePath('router.js'), this.destinationPath(`routes/${this.props.name}.js`), { name: this.props.name });
    const indexSource = this.fs.read(this.destinationPath('routes/index.js'));
    const ast = addImport(addRouter(getAst(indexSource), this.props.codename), this.props.codename, `@/routes/${this.props.name}`);
    this.fs.write(this.destinationPath('routes/index.js'), stringify(ast, indexSource));
  }

  end() {
    this.log(
      cowsay.think({ text: `${chalk.red('done @_@')}` })
    );
  }
};
