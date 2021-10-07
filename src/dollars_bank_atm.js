import customer_account from "./customer_account";

class dollars_bank_atm {

    constructor() {
        this.accounts = [];
    }

    addAccount = (email, firstName, lastName, password, initialBalance) => {
        let account = new customer_account(email, firstName, lastName, password, initialBalance);
        this.accounts.push(account);
    }

    transfer = (account1, account2, amount) => {
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
}

export default dollars_bank_atm;