'use strict';

// Create accounts
const account1 = {
  owner: 'Abasa Wandega',
  movement: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interstRate: 1.2, // 1.2%
  pin: 1111,
};

const account2 = {
  owner: 'Simon Ojok',
  movement: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interstRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Wilber Natamba',
  movement: [200, -200, 340, -300, -20, 50, 400, -460],
  interstRate: 0.7,
  pin: 333,
};

const account4 = {
  owner: 'Pius Omoding',
  movement: [430, 1000, 700, 50, 90],
  interstRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];
