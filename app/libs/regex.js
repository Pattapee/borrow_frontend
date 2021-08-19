module.exports = {
  uuid: /^[a-f0-9\-]{36}$/,
  uuids: /^([a-f0-9\-]{36})(\,\s*([a-f0-9\-]{36}))*$/,
  statusInstance: /^(start|stop|reboot)$/,
  statusVolume: /^(available|in\-use)$/,
  internal: /^(LOCAL|INT)(.*)$/,
  externalIp: /^(10)(.*)$/
};
