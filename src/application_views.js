import readlineSync from 'readline-sync';
import dateFormat from 'dateformat';

class application_views {

    constructor() {
        this.money = new Intl.NumberFormat('en-US',
            { style: 'currency', currency: 'USD',
            minimumFractionDigits: 2 });
    }

    initialPrompt = () => {
        console.log("Welcome to DollarsBank ATM!\n\n");

        const options = ['Login', 'New Account'];
        let index = readlineSync.keyInSelect(options, 'Please select an option: ');
        // prevents a 0 for being returned from option 1
        return index + 1;        
    }

    loginPrompt = () => {
        console.log("Please log in below:");

        let email = readlineSync.questionEMail("User Email: ");
        
        // make sure the pin follows the correct format
        let pin = readlineSync.question("4-digit PIN: ", {
            limit: /^[0-9]{4}$/,
            limitMessage: "Please input a 4-digit PIN."});
        
        return {
            email: email,
            pin: pin
        };        
    }

    transaction = () => {
        let yesOrEmpty = readlineSync.keyInYN("Perform another transaction?");
        // if it's empty or false, exit the program
        if(yesOrEmpty === '' || yesOrEmpty == false) {
            process.exit();
        }
        // otherwise the value is true. Continue the prompt
        let options = ["Account Balance Check", 
            "Print Transactions", 
            "Update PIN", 
            "Withdraw Amount", 
            "Deposit Amount", 
            "Transfer",
            "Customer Information"];
        let index = readlineSync.keyInSelect(options, "Transaction Menu: ");
        // prevents a 0 for being returned from option 1
        return index + 1;
    }

    /* Methods for Transaction menu items */

    displayBalance = (balance) => {
        console.log(`Your balance is ${this.money.format(balance)}`);
    }

    displayTransactions = (transactions) => {
        console.log("Time\t\t\t\tMessage\t\t\t\tBefore\t\tAmount\t\tAfter");
        for(let i = 0; i < transactions.length; i++) {
            let t = transactions[i]; // get the next transaction
            let date = dateFormat(t.time);
            console.log(`${date}\t${t.message}\t${t.previousBalance}\t\t${t.amount}\t\t${t.newBalance}`);
        }
    }

    // used to view a single transaction
    viewTransaction = (t) => {
        console.log("Transaction successful!\n");
        console.log("Time\t\t\t\tMessage\t\t\t\tBefore\t\tAmount\t\tAfter");
        let date = dateFormat(t.time);
        console.log(`${date}\t${t.message}\t${t.previousBalance}\t\t${t.amount}\t\t${t.newBalance}`);
    }

    // used to display account info
    viewAccount = (info) => {
        console.log(`Name: ${info.name}`);
        console.log(`Email: ${info.email}`);
        console.log(`Account ID: ${info.id}`);
    }

    // used to transfer money to another account
    transfer = (accounts) => {
        // show a list of accounts
        for(let i = 0; i < accounts.length; i++) {
            let account = accounts[i];
            console.log(`Account ID\tName\tEmail`);
            console.log(`${account.id}\t${account.name}\t${account.email}`);
        }
        let target = readlineSync.questionInt("Please enter an Account ID to transfer: ");
        let amount = readlineSync.questionFloat("Amount to transfer: ");
        while(amount <= 0) {
            amount = readlineSync.questionFloat("Please enter a positive value to transfer: ");
        }
        return {
            account: target,
            amount: amount
        }
    }

    // update the current account's pin
    newPin = () => {
        let oldPin = readlineSync.question("4-digit PIN: ", {
            limit: /^[0-9]{4}$/,
            limitMessage: "Please input a 4-digit PIN."});
        // get the new PIN
        let validPin = false;
        let newPin = null;
        do {
            newPin = readlineSync.question("New 4-digit PIN: ", {
                limit: /^[0-9]{4}$/,
                limitMessage: "Please input a 4-digit PIN."});
            let confirmPin = readlineSync.question("Confirm New PIN: ");
            if(confirmPin === newPin) {
                validPin = true;
            }
            else {
                console.log("PIN does not match. Please try again.");
            }
        } while(!validPin);
        return {
            oldPin: oldPin,
            newPin: newPin
        };
    }

    withdraw = () => {
        let amount = readlineSync.questionFloat("Amount to withdraw: ");
        while(amount <= 0) {
            amount = readlineSync.questionFloat("Please enter a positive value to withdraw: ");
        }
        return amount;
    }

    deposit = () => {
        let amount = readlineSync.questionFloat("Amount to deposit: ");
        while(amount <= 0) {
            amount = readlineSync.questionFloat("Please enter a positive value to deposit: ");
        }
        return amount;
    }

    newAccount = () => {
        console.log("New Account Creation!\n\nPlease enter the following information:\n");
        let email = "";
        let name = "";
        let pin = "";
        let initialBalance = 0;

        //get the email
        email = readlineSync.questionEMail("Email: ");

        // get the name
        name = readlineSync.question("Name: ");

        // get the PIN
        let validPin = false;
        do {
            pin = readlineSync.question("4-digit PIN: ", {
                limit: /^[0-9]{4}$/,
                limitMessage: "Please input a 4-digit PIN."});
            let confirmPin = readlineSync.question("Confirm PIN: ");
            if(confirmPin === pin) {
                validPin = true;
            }
            else {
                console.log("PIN does not match. Please try again.");
            }
        } while(!validPin);

        // get the initial balance
        initialBalance = readlineSync.question("Initial Balance(Format 00.00):", {
            limit: /^[0-9]+\.[0-9]{2}$/,
            limitMessage: "Please input a valid dollar amount."
        });
        
        // all fields have been filled
        // return the object containing the info for the new account
        let accountInfo = {
            email: email,
            name: name,
            pin: pin,
            initialBalance: initialBalance
        }
        return accountInfo;        
    }
}

export default application_views;