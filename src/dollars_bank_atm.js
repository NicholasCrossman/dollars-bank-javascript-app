import customer_account from "./customer_account.js";

class dollars_bank_atm {

    constructor() {
        this.accounts = [];
    }

    // basic operations methods

    deposit = (account_id, amount) => {
        let account = this.getAccount(account_id);
        if(account == null) {
            return null;
        }
        if(amount <= 0) {
            // reject the deposit if the amount is negative or zero
            return null;
        }
        // otherwise, perform the deposit as normal and return the transaction
        return account.transaction(amount, "Deposit of $" + amount);
    }

    withdrawl = (account_id, amount) => {
        let account = this.getAccount(account_id);
        if(account == null) {
            return null;
        }
        if(amount <= 0) {
            // reject the withdrawl if the amount is negative or zero
            return null;
        }
        // otherwise, perform the withdrawl as normal and return the transaction
        amount = amount * -1; // make amount a negative value
        return account.transaction(amount, "Withdrawl of $" + amount);
    }

    fiveReventTransactions = (account_id) => {
        let account = this.getAccount(account_id);
        if(account == null) {
            return null;
        }
        return account.lastFiveTransactions();
    }

    transfer = (accountId1, accountId2, amount) => {
        // make sure both accounts exist
        let account1 = this.getAccount(accountId1);
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

    addAccount = (email, name, account_id, pin, initialBalance) => {
        let account = new customer_account(email, name, account_id, pin, initialBalance);
        this.accounts.push(account);
    }

    getAccount = (id) => {
        for(let i = 0; i < this.accounts.length; i++) {
            let account = this.accounts[i];
            if(account.account_id == id) {
                return account;
            }
        }
        return null;
    }

}

export default dollars_bank_atm;