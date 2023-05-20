'use strict';

// Create accounts
const account1 = {
  owner: 'Abasa Wandega',
  txns: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interstRate: 1.2, // 1.2%
  pin: 1111,
};

const account2 = {
  owner: 'Simon Peter Ojok',
  txns: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interstRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Wilber Natamba',
  txns: [200, -200, 340, -300, -20, 50, 400, -460],
  interstRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Pius Omoding',
  txns: [430, 1000, 700, 50, 90],
  interstRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

// Display transactions
const displayTrxns = function (txns) {
  // Empty transactions container
  containerTxns.innerHTML = '';

  txns.forEach(function (txn, i) {
    const type = txn > 0 ? 'deposit' : 'withdrawal';

    // Generate transactions html
    const txnHtml = `
      <div class="txns__row">
        <div class="txns__type txns__type--${type}">${i + 1} ${type}</div>
        <div class="txns__date">24/01/2023</div>
        <div class="txns__value">${txn}€</div>
      </div>
    `;

    // Attach transactions html to transaction container
    containerTxns.insertAdjacentHTML('afterbegin', txnHtml);
  });
};

// Calculate and display balance
// const displayBalance = function (txns) {
//   const balance = txns.reduce((acc, txn) => acc + txn, 0);
//   labelBalance.textContent = `${balance}€`;
// };
const displayBalance = function (acct) {
  acct.balance = acct.txns.reduce((acc, txn) => acc + txn, 0);
  labelBalance.textContent = `${acct.balance}€`;
};

// Calculate and display summaries
const displaySummaries = function (acct) {
  const totalIncome = acct.txns
    .filter(txn => txn > 0)
    .reduce((acc, deposit) => acc + deposit, 0);
  labelSumIn.textContent = `${totalIncome}€`;

  const totalOut = acct.txns
    .filter(txn => txn < 0)
    .reduce((acc, out) => acc + out, 0);
  labelSumOut.textContent = `${Math.abs(totalOut)}€`;

  // Interest (1.2% of each deposit) - paid only if it is at least 1€
  const interest = acct.txns
    .filter(txn => txn > 0)
    .map(dep => (dep * acct.interstRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

// Create username property and add them account objects
const createUsernames = accs =>
  accs.forEach(
    acc =>
      (acc.username = acc.owner
        .toLowerCase()
        .split(' ')
        .map(nm => nm[0])
        .join(''))
  );

createUsernames(accounts);

let activeAccount;

// Create event handlers
btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); // prevent form from submitting

  activeAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (activeAccount?.pin === Number(inputLoginPin.value)) {
    // Display welcome message and UI
    labelWelcome.textContent = `Welcome ${activeAccount.owner.split(' ')[0]}!`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Display movements / transactions
    displayTrxns(activeAccount.txns);

    // Display balance
    displayBalance(activeAccount);

    // Display summary
    displaySummaries(activeAccount);
  }

  // Transfer funds
  btnTransfer.addEventListener('click', function (e) {
    e.preventDefault();

    const amount = Number(inputTransferAmount.value);
    const receipientAccount = accounts.find(
      acc => acc.username === inputTransferTo.value
    );

    // Set tranfer conditions (positive values only, amount <= balance of the account transfering, transfer to the same account not allowed and that the receipient account exists)
    if (
      receipientAccount &&
      amount > 0 &&
      amount <= activeAccount.balance &&
      receipientAccount?.username !== activeAccount.username
    ) {
    }
  });
});
