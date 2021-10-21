
class customer_account {

    /**
     * Constructor for a new customer_account. It takes in an email, name, 
     * account_id, pin, and initialBalance. The account_id should be auto-generated 
     * by dollars_bank_atm, and be unique in the system.
     * @param {*} email String - The user's email.
     * @param {*} name String - The user's name.
     * @param {*} account_id int - The unique account ID for this customer.
     * @param {*} pin int - A 4-digit PIN code.
     * @param {*} initialBalance float - An initial positive balance for the account.
     */
    constructor(email, name, account_id, pin, initialBalance) {
        this.email = email;
        this.name = name;
        this.account_id = account_id;
        this.pin = pin;
        this.transactions = [];
        this.balance = 0.0;
        this.transaction(initialBalance, "Initial balance.");
    }

    /**
     * Adds a new transaction to the account's data. This takes in an amount, 
     * which is positive for a deposit and negative for a withdrawl, and a message to 
     * help identify the transaction. The method checks for an overdraft when performing 
     * a withdrawl, and returns null instead of completing it if the account has insufficient funds. 
     * The account returns the transaction object after creating it and adding it to the collection.
     * @param {*} amount float - The amount to deposit or withdraw. Can be positive or negative.
     * @param {*} message String - The message associated with the transaction.
     * @returns Object - The Transaction object created, or null if an overdraft occurs. Returns 0 if 
     *                  the amount is 0.
     */
    transaction = (amount, message) => {
        if(amount > 0) {
            // the transaction is a deposit
            // no errors need to be checked
            const oldBalance = this.balance;
            this.balance += parseFloat(amount);
            // add the transaction to the log and return it
            return this.recordTransaction(oldBalance, amount, message);
        }
        else if(amount < 0) {
            // the transaction is a withdrawl. Check for overdraft before subtracting.
            const isOverdraft = (this.balance + parseFloat(amount)) < 0;
            if(isOverdraft) {
                // reject the operation, return false
                return null;
            }
            // if it's not an overdraft
            // do the withdrawl
            const oldBalance = this.balance;
            this.balance += parseFloat(amount);
            // add the transaction to the log and return it
            return this.recordTransaction(oldBalance, amount, message);
        }
        else {
            // the amount is zero
            // do nothing, but return a success
            return 0;
        }
    }

    /**
     * Creates and returns a new transaction object, used by the transaction() method to log 
     * deposits and withdrawls. The transaction has a previousBalance, amount, currentBalance, 
     * the time of the transaction, and the associated message. This takes the oldBalance, amount, and 
     * newBalance as input, as well as a message.
     * @param {*} oldBalance float - The balance before this transaction.
     * @param {*} amount float - The amount of the transaction, positiveor negative.
     * @param {*} message String - The message associated with the transaction.
     * @returns Object - The transaction object, with the previousBalance, amount, newBalance, time, and message.
     */
    recordTransaction = (oldBalance, amount, message) => {
        let transaction = {
            previousBalance: parseFloat(oldBalance),
            amount: parseFloat(amount),
            newBalance: parseFloat(this.balance),
            time: new Date(),
            message: message
        }
        this.transactions.push(transaction);
        return transaction;
    }

    /**
     * Returns the last 5 transactions of the account, or all transactions if fewer than 5 
     * are present. The account should always have an initial balance transaction.
     * @returns List[] - The last 5 transactions, or all if there are less than 5. Returns 
     *                  null if there are none, but this should not occur.
     */
    lastFiveTransactions = () => {
        // make sure the array isn't empty
        if(this.transactions.length == 0) {
            return null;
        }
        // make sure there are at least 5 to return
        if(this.transactions.length >= 5) {
            // loop backwards over the array
            const arrayEnd = this.transactions.length - 1;
            const fiveLess = arrayEnd - 5;
            let returnedItems = [];
            for(let i = arrayEnd; i > fiveLess; i--) {
                returnedItems.push(this.transactions[i]);
            }
            return returnedItems;
        }
        // if there are less than 5, return them all
        return this.transactions;
    }

    /**
     * Returns the account's name, email, and id, without the PIN for security reasons.
     * @returns Object - The account's name, email, and ID.
     */
    accountInfo = () => {
        return {
            name: this.name,
            email: this.email,
            id: this.account_id
        }
    }
}

export default customer_account;