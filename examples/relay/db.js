'use strict';

function Group(id, name) {
  this.id = id || groups.length;
  this.name = name;
  this.members = [];
}


function User(id, nick, group) {
  this.id = id || users.length;
  this.employeeId = nick + this.id;
  this.nick = nick;
  this.group = group;
  if (group) {
    group.members.push(this);
  }
}


const groups = [
  new Group(1, 'Group 1'),
  new Group(2, 'Group 2')
];


const users = [
  new User(1, 'Lars', groups[0]),
  new User(2, 'Deathvoid', groups[0]),
  new User(3, 'Grishan', groups[1])
];


module.exports = {
  getUser: (id) => users.find(u => u.id === id),
  getGroup: (id) => groups.find(g => g.id === id),
  getUsers: () => users,
  getGroups: () => groups,
  createUser: (nick, group) => users[users.push(new User(null, nick, group)) - 1],
  createGroup: (name) => groups[groups.push(new Group(null, name)) - 1],
  User,
  Group
};
