import customer_account from "./customer_account";

class dollars_bank_atm {

    constructor() {
        this.accounts = [];
    }

    addAccount = (email, firstName, lastName, password, initialBalance) => {
        let account = new customer_account(email, firstName, lastName, password, initialBalance);
        this.accounts.push(account);
    }
}