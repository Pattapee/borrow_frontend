var crypto = require('crypto');
var request = require('request-promise').defaults({jar: true})

var promiseFor = Promise.method(function(condition, action, value) {
    if (!condition(value)) return value;
    return action(value).then(promiseFor.bind(null, condition, action));
});

module.exports = {

  responseSuccess: function (res, data) {
    data = _.toArray(data)
    if (data.length == 2) {
      res.status(data[0]).send(data[1]);
    } else if (data[0] == 204) {
      res.sendStatus(204).end();
    } else {
      this.responseError(res);
    }
  },

  responseError: function (res, err) {
    err = this.extractError(err);
    var message = _.uniq(err[1]);
    if(!_.isEmpty(message)){
      res.status(err[0]).send({errors: _.flattenDeep([message])});
    } else {
      res.status(500).send({errors: ["Internal server error, please report this bug"]});
    }
  },

  extractError: function (err) {
    if(err == null || err == undefined){
      return [];
    }
    if(_.isArray(err) == false) {
      err = err.toString().slice(7, err.length).split(',')
      err = [err[0], err.slice(1, err.length)]
    }
    return err;
  }




};
