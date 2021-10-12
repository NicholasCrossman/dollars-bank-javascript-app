
class customer_account {

    constructor(email, name, account_id, pin, initialBalance) {
        this.email = email;
        this.name = name;
        this.account_id = account_id;
        this.pin = pin;
        this.transactions = [];
        this.balance = 0.0;
        this.transaction(initialBalance, "Initial balance.");
    }

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

    accountInfo = () => {
        return {
            name: this.name,
            email: this.email,
            id: this.account_id
        }
    }
}

export default customer_account;