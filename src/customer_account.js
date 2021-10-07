
class customer_account {

    constructor(email, firstName, lastName, password, initialBalance) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
        this.transactions = [];
        this.balance = 0.0;
    }

    transaction = (amount) => {
        if(amount > 0) {
            // the transaction is a deposit
            // no errors need to be checked
            const oldBalance = this.balance;
            this.balance += amount;
            // add the transaction to the log
            this.recordTransaction(oldBalance, amount);
            return true; // confirm the operation is a success
        }
        else if(amount < 0) {
            // the transaction is a withdrawl. Check for overdraft before subtracting.
            const isOverdraft = (this.balance + amount) < 0;
            if(isOverdraft) {
                // reject the operation, return false
                return false;
            }
            // if it's not an overdraft
            // do the withdrawl
            const oldBalance = this.balance;
            this.balance += amount;
            // add the transaction to the log
            this.recordTransaction(oldBalance, amount);
            return true;
        }
        else {
            // the amount is zero
            // do nothing, but return a success
            return true;
        }
    }

    recordTransaction = (oldBalance, amount) => {
        let transaction = {
            previousBalance: oldBalance,
            amount: amount,
            newBalance: this.balance,
            time: new Date()
        }
        this.transactions.push(transaction);
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
}