var joi = Promise.promisifyAll(require('joi'));

module.exports = {

  joi: function(data, schema) {
    opts = {
      abortEarly: false,
      convert: true,
      allowUnknown: false,
      stripUnknown: false
    }
    return joi.validateAsync(data, schema, opts)
      .then(function(obj){
        return obj;
      })
      .catch(function(err){
        var errs = _.map(err.details, function(e) {
          var key = _.compact(e.path.split('.'))[0];
          var x = e.type;
          var _postfix = undefined;
          switch(_.last(x.split('.'))) {
            case 'required':
              _postfix = 'required';
              break;
            case 'allowUnknown':
              _postfix = 'not allowed';
              break;
            default:
              _postfix = 'invalid format'
              break;
            }
          return `${_.capitalize(key)} is ${_postfix}`;
        });
        throw new Error([400, errs]);
      });
  }
};
