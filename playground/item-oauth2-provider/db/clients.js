'use strict';

const clients = [
  { id: '1', name: 'ship', clientId: 'item_ship', clientSecret: 'item_ship_secret', isTrusted: false },
  { id: '2', name: 'di', clientId: 'item_di', clientSecret: 'item_di_secret', isTrusted: true },
];

module.exports.findById = (id, done) => {
  console.log('id------>',id)
  for (let i = 0, len = clients.length; i < len; i++) {
    if (clients[i].id === id) return done(null, clients[i]);
  }
  return done(new Error('Client Not Found'));
};

module.exports.findByClientId = (clientId, done) => {
  for (let i = 0, len = clients.length; i < len; i++) {
    if (clients[i].clientId === clientId) return done(null, clients[i]);
  }
  return done(new Error('Client Not Found'));
};
