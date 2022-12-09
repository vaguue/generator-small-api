import _ from 'lodash';

function omitDeep(collection, excludeKeys) {
  function omitFn(value) {
    if (value && typeof value === 'object') {
      excludeKeys.forEach((key) => {
        delete value[key];
      });
    }
  }
  return _.cloneDeepWith(collection, omitFn);
}

function viewMongo(obj) {
  return omitDeep(obj, ['_id', '__v']);
}

export default viewMongo;
