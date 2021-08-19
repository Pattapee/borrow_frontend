module.exports = {

  duplicateKey: function(key) {
    key = key || 'key'
    return new Error([409, `Duplicate ${key}`]);
  },
  notFound: function(key) {
    key = key || 'key'
    return new Error([404, `${key} not found`]);
  },
  badImplement: function(msg) {
    msg = msg || ''
    return new Error([400, `Bad implement ${msg}`]);
  },
  timeout: function(msg) {
    msg = msg || ''
    return new Error([504, `Gateway timeout ${msg}`]);
  },
  unauthorized: function(msg) {
    msg = msg || ''
    return new Error([401, `Unauthorized, ${msg}`]);
  },
  forbidden : function(msg){
    msg = msg||'';
    return new Error([403, `Forbidden, ${msg}`]);
  }

}
