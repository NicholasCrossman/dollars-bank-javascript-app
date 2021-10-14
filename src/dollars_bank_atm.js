import customer_account from "./customer_account.js";

class dollars_bank_atm {

    constructor() {
        this.accounts = {};
        this.currentAccount = null;
        this.addAccount("bork@gmail.com", "Bork Borksson", "1234", 35.00);
    }

    // sets the current active account
    login = (email, pin) => {
        //console.log(`Login: ${email}, ${pin}`);
        for(let key in this.accounts) {
            let account = this.accounts[key];
            console.log(`Account: ${JSON.stringify(account)}`);
            if(account.email == email) {
                if(account.pin == pin) {
                    console.log("Logged in.");
                    this.currentAccount = account;
                    return true;
                }
            }
        }
        return false;
    }

    accountInfo = () => {
        return this.currentAccount.accountInfo();
    }

    /**
     * Returns all accounts but the current one. Used to 
     * show options for a transfer.
     * Returns an array of accountInfo.
     */
    allOtherAccounts = () => {
        let otherAccounts = [];
        for(let key in this.accounts) {
            if(key != this.currentAccount.account_id) {
                // as long as it's not the current account
                // add it to the return object
                otherAccounts.push(this.accounts[key].accountInfo());
            }
        }
        return otherAccounts;
    }

    updatePin = (oldPin, newPin) => {
        // make sure the old pin matches
        if(oldPin != this.currentAccount.pin) {
            return false;
        }
        this.currentAccount.pin = newPin;
        return true;
    }

    // basic operations methods

    balance = () => {
        // make sure the active account is set
        if(this.currentAccount == null) {
            return null;
        }
        return parseFloat(this.currentAccount.balance);
    }

    deposit = (amount) => {
        // make sure the active account is set
        if(this.currentAccount == null) {
            return null;
        }
        
        if(amount <= 0) {
            // reject the deposit if the amount is negative or zero
            return null;
        }
        // otherwise, perform the deposit as normal and return the transaction
        return this.currentAccount.transaction(amount, "Deposit of $" + amount);
    }

    withdrawl = (amount) => {
        // make sure the active account is set
        if(this.currentAccount == null) {
            return null;
        }
        
        if(amount <= 0) {
            // reject the withdrawl if the amount is negative or zero
            return null;
        }
        // otherwise, perform the withdrawl as normal and return the transaction
        amount = amount * -1; // make amount a negative value
        return this.currentAccount.transaction(amount, "Withdrawl of $" + amount);
    }

    /**
     * Shows the five most recent transactions.
     * @returns An array of the 5 most recent transactions.
     */
    fiveReventTransactions = () => {
        if(this.currentAccount == null) {
            return null;
        }
        return this.currentAccount.lastFiveTransactions();
    }

    /**
     * Returns the most recent transaction. Used to show an operation was 
     * successful.
     * @returns Returns a transaction object.
     */
    lastTransaction = () => {
        if(this.currentAccount == null) {
            return null;
        }
        let trans = this.currentAccount.transactions;
        // return the most recent transaction
        return trans[trans.length - 1];
    }

    /**
     * Transfers mooney from the current account to another.
     * Returns true if successful, and false if the second account 
     * doesn't exist or the current account's balance is insufficient.
     * @param int accountId2 - The integer ID of the target account.
     * @param float amount - The amount to transfer.
     * @returns True if successful, and false if the second account is not found 
     *          or currentAccount has insufficient balance.
     */
    transfer = (accountId2, amount) => {
        // make sure both accounts exist
        let account1 = this.currentAccount;
        let account2 = this.getAccount(accountId2);
        // return false if either account doesn't exist
        if(account1 == null || account2 == null) {
            return false;
        }
        // make sure the amount is positive
        if(amount < 0) {
            return false;
        }
        // transfer money from account1 into account2
        // first make sure account1 has the monmey required
        const moneyAvailable = account1.balance > amount;
        if(moneyAvailable) {
            // get the money from account 1
            let withdrawlSuccess = account1.transaction(amount * -1, "Transfer to " + account2.email);
            if(withdrawlSuccess) {
                // trandfer the money to account2
                let transferSuccess = account2.transaction(amount, "Transfer from " + account1.email);
                if(transferSuccess) {
                    return true;
                }
            }
        }
        // account1 lacks the funds to transfer
        return false;
    }

    // account methods

    addAccount = (email, name, pin, initialBalance) => {
        let accountId = this.randomId();
        let account = new customer_account(email, name, accountId, pin, initialBalance);
        console.log("ATM: Account: " + JSON.stringify(account));
        this.accounts[accountId] = account;
        return account;
    }

    // returns a unique ID for use in the Account
    randomId = () => {
        let id = null;
        do {
            id = this.randomInt();
        } while (this.keyExists(id));
        return id;
    }

    // private helper to generate a random int
    // returns a value between 1 and 10000
    randomInt = () => {
        return Math.floor(
            Math.random() * (10000 - 1) + 1
        )
    }

    // used to make sure the ID is unique
    keyExists = (id) => {
        for(let key in this.accounts) {
            if(id === key) {
                return true;
            }
        }
        return false;
    }

    getAccount = (id) => {
        for(let key in this.accounts) {
            let account = this.accounts[key];
            if(account.account_id == id) {
                return account;
            }
        }
        return null;
    }

}

export default dollars_bank_atm;