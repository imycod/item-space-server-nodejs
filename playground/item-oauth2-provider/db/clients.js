'use strict';

const clients = [
  {
    id: '1',
    name: 'ship',
    clientId: 'abc123',
    clientSecret: 'ssh-secret',
    isTrusted: false,
    redirectUri: 'http://127.0.0.1:3000/callback',
  },
  {
    id: '2',
    name: 'di',
    clientId: 'xyz123',
    clientSecret: 'ssh-password',
    isTrusted: true,
    redirectUri: 'http://127.0.0.1:3000/callback',
  },
];

module.exports.findById = (id, done) => {
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
