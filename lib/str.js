const slugify = require('slugify');

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

const decapitalize = str => str.charAt(0).toLowerCase() + str.slice(1);

const slug = str => slugify(str, {
  replacement: '',
  remove: /-/,
  lower: false,
  strict: false,
  locale: 'vi',
  trim: true
});

module.exports = { slug, capitalize, decapitalize };
