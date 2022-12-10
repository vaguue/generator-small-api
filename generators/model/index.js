const fs = require('fs');
const path = require('path');
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const cowsay = require('cowsay');

const { capitalize, decapitalize, slug } = require('../../lib/str');
const { getAst, stringify, addImport, modifyModelMap, addExportToTop, addExportDefaultToTop } = require('../../lib/ast');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.argument('name', { type: String, required: false  });
    this.option('pipeline');
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
    this.props.name = capitalize(slug(this.props.name));
    this.props.codename = decapitalize(this.props.name);
    this.sourceRoot(path.join(__dirname, 'templates'));
  }

  writing() {
    this.log(chalk.red('[*] writing...'));

    const indexSource = this.fs.read(this.destinationPath('models/index.js'));
    //const ast = modifyModelMap(addImport(getAst(indexSource), this.props.codename), this.props.codename);
    const ast = addExportDefaultToTop(getAst(indexSource), this.props.codename);

    this.fs.write(this.destinationPath('models/index.js'), stringify(ast, indexSource));
    this.fs.copyTpl(this.templatePath('model.js'), this.destinationPath(`models/${this.props.codename}.js`), { name: this.props.name });

    if (this.options.pipeline) {
      this.fs.copyTpl(this.templatePath('pipeline.js'), this.destinationPath(`models/mongo-pipelines/${this.props.codename}.js`));

      const pipelineIndex = this.fs.read(this.destinationPath(`models/mongo-pipelines/index.js`));
      const ast = addExportToTop(getAst(pipelineIndex), this.props.codename);

      this.fs.write(this.destinationPath(`models/mongo-pipelines/index.js`), stringify(ast, pipelineIndex));
    }
  }

  end() {
    this.log(
      cowsay.think({ text: `${chalk.red('done @_@')}`  })
    );
  }
};
