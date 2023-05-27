'use strict';

// Create accounts
const account1 = {
  owner: 'Abasa Wandega',
  txns: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interstRate: 1.2, // 1.2%
  pin: 1111,
  txnDates: [
    '2020-11-18T21:31:17.178Z',
    '2023-12-23T07:42:02.383Z',
    '2023-01-28T09:15:04.904Z',
    '2023-04-01T10:17:24.185Z',
    '2023-05-08T14:11:59.604Z',
    '2023-05-20T04:01:17.194Z',
    '2023-05-25T12:36:17.929Z',
    '2023-05-26T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Simon Peter Ojok',
  txns: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interstRate: 1.5,
  pin: 2222,
  txnDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Wilber Natamba',
  txns: [200, -200, 340, -300, -20, 50, 400, -460],
  interstRate: 0.7,
  pin: 3333,
  txnDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const accounts = [account1, account2, account3];

const select = selector => document.querySelector(selector);

// Elements
const labelWelcome = select('.welcome');
const labelDate = select('.date');
const labelBalance = select('.balance__value');
const labelSumIn = select('.summary__value--in');
const labelSumOut = select('.summary__value--out');
const labelSumInterest = select('.summary__value--interest');
const labelTimer = select('.timer');

const containerApp = select('.app');
const containerTxns = select('.txns');

const btnLogin = select('.login__btn');
const btnTransfer = select('.form__btn--transfer');
const btnLoan = select('.form__btn--loan');
const btnClose = select('.form__btn--close');
const btnSort = select('.btn--sort');

const inputLoginUsername = select('.login__input--user');
const inputLoginPin = select('.login__input--pin');
const inputTransferTo = select('.form__input---to');
const inputTransferAmount = select('.form__input--amount');
const inputLoanAmount = select('.form__input--loan-amount');
const inputCloseUsername = select('.form__input--user');
const inputClosePin = select('.form__input--pin');

const currencies = new Map([
  ['USD', 'United States Dollars'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound Sterling'],
]);

const now = new Date();

const formatTxnDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(now, date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCurrency = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

// Display transactions
const displayTrxns = function (acct, sort = false) {
  // Empty transactions container
  containerTxns.innerHTML = '';

  const transactions = sort
    ? acct.txns.slice().sort((a, b) => a - b)
    : acct.txns;

  transactions.forEach(function (txn, i) {
    const type = txn > 0 ? 'deposit' : 'withdrawal';

    const txnDate = new Date(acct.txnDates[i]);
    const dateStr = formatTxnDate(txnDate, acct.locale);
    const formattedTxn = formatCurrency(txn, acct.locale, acct.currency);

    // Generate transactions html
    const txnHtml = `
      <div class="txns__row">
        <div class="txns__type txns__type--${type}">${i + 1} ${type}</div>
        <div class="txns__date">${dateStr}</div>
        <div class="txns__value">${formattedTxn}</div>
      </div>
    `;

    // Attach transactions html to transaction container
    containerTxns.insertAdjacentHTML('afterbegin', txnHtml);
  });
};

const displayBalance = function (acct) {
  acct.balance = acct.txns.reduce((acc, txn) => acc + txn, 0);
  labelBalance.textContent = formatCurrency(
    acct.balance,
    acct.locale,
    acct.currency
  );
};

// Calculate and display summaries
const displaySummaries = function (acct) {
  const totalIncome = acct.txns
    .filter(txn => txn > 0)
    .reduce((acc, deposit) => acc + deposit, 0);
  labelSumIn.textContent = formatCurrency(
    totalIncome,
    acct.locale,
    acct.currency
  );

  const totalOut = acct.txns
    .filter(txn => txn < 0)
    .reduce((acc, out) => acc + out, 0);
  labelSumOut.textContent = formatCurrency(
    totalOut,
    acct.locale,
    acct.currency
  );

  // Interest (1.2% of each deposit) - paid only if it is at least 1€
  const interest = acct.txns
    .filter(txn => txn > 0)
    .map(dep => (dep * acct.interstRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCurrency(
    interest,
    acct.locale,
    acct.currency
  );
};

// Create username property and add them account objects
const createUsernames = accts =>
  accts.forEach(
    acct =>
      (acct.username = acct.owner
        .toLowerCase()
        .split(' ')
        .map(nm => nm[0])
        .join(''))
  );
createUsernames(accounts);

const updateUI = function (acct) {
  displayTrxns(acct);
  displayBalance(acct);
  displaySummaries(acct);
};

let activeAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); // prevent form from submitting

  activeAccount = accounts.find(
    acct => acct.username === inputLoginUsername.value
  );

  if (activeAccount?.pin === Number(inputLoginPin.value)) {
    // Display welcome message and UI
    labelWelcome.textContent = `Welcome ${activeAccount.owner.split(' ')[0]}!`;
    containerApp.style.opacity = 100;

    // Calculate and display date information using Intl API
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      weekday: 'long',
    };
    const locale = navigator.language; // browser locale (not used)
    labelDate.textContent = new Intl.DateTimeFormat(
      activeAccount.locale,
      options
    ).format(now);

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    updateUI(activeAccount);
  }

  // Transfer funds
  btnTransfer.addEventListener('click', function (e) {
    e.preventDefault();

    const amount = Number(inputTransferAmount.value);
    const receipientAccount = accounts.find(
      acct => acct.username === inputTransferTo.value
    );
    inputTransferTo.value = inputTransferAmount.value = '';

    // Set tranfer conditions (positive values only, amount <= balance of the account transfering, transfer to the same account not allowed and that the receipient account exists)
    if (
      receipientAccount &&
      amount > 0 &&
      amount <= activeAccount.balance &&
      receipientAccount?.username !== activeAccount.username
    ) {
      activeAccount.txns.push(-amount);
      activeAccount.txnDates.push(now.toISOString());
      receipientAccount.txns.push(amount);
      receipientAccount.txnDates.push(now.toISOString());

      updateUI(activeAccount);
    }

    inputTransferTo.value = inputTransferAmount.value = '';
  });

  // Take loan
  btnLoan.addEventListener('click', function (e) {
    e.preventDefault();

    const amount = Math.floor(inputLoanAmount.value);
    if (amount > 0 && activeAccount.txns.some(txn => txn >= amount * 0.1)) {
      activeAccount.txns.push(amount);
      activeAccount.txnDates.push(now.toISOString());
    }

    inputLoanAmount.value = '';
    inputLoanAmount.blur();

    updateUI(activeAccount);
  });

  // Close account
  btnClose.addEventListener('click', function (e) {
    e.preventDefault();

    if (
      inputCloseUsername.value === activeAccount.username &&
      Number(inputClosePin.value) === activeAccount.pin
    ) {
      const currentIndex = accounts.findIndex(
        acct => acct.username === activeAccount.username
      );
      accounts.splice(currentIndex, 1);

      labelWelcome.textContent = `Hey ${
        activeAccount.owner.split(' ')[0]
      }, your account has been closed!`;

      // Hide UI
      containerApp.style.opacity = 0;
    }
  });
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayTrxns(activeAccount.txns, !sorted);
  sorted = !sorted;
});
