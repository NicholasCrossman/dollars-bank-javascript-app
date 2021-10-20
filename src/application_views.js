import readlineSync from 'readline-sync';
import dateFormat from 'dateformat';
import colors from 'colors';
/**
 * colors:
 *  green: greetings and labels
 *  white/default: output data, like a transaction printout
 *  blue: prompt for input
 *  red: errors and re-prompts
 */

class application_views {

    constructor() {
        this.money = new Intl.NumberFormat('en-US',
            { style: 'currency', currency: 'USD',
            minimumFractionDigits: 2 });
    }

    initialPrompt = () => {
        console.log("Welcome to DollarsBank ATM!\n\n".green);

        const options = ['Login', 'New Account'];
        let index = readlineSync.keyInSelect(options, 'Please select an option: '.green);
        // prevents a 0 for being returned from option 1
        return index + 1;        
    }

    loginPrompt = () => {
        console.log("Please log in below:".green);

        let email = readlineSync.questionEMail("User Email: ".blue);
        
        // make sure the pin follows the correct format
        let pin = readlineSync.question("4-digit PIN: ".blue, {
            limit: /^[0-9]{4}$/,
            limitMessage: "Please input a 4-digit PIN.".red});
        
        return {
            email: email,
            pin: pin
        };        
    }

    transaction = () => {
        let yesOrNo = readlineSync.keyInYN("Perform another transaction?".green);
        // this returns a boolean. True if 'y' is entered, and false otherwise.
        if(!yesOrNo) {
            // exit the program gracefully
            console.log("Goodbye.".green);
            process.exit(1);
        }
        // otherwise the value is true. Continue the prompt
        let options = ["Account Balance Check", 
            "Print Transactions", 
            "Update PIN", 
            "Withdraw Amount", 
            "Deposit Amount", 
            "Transfer",
            "Customer Information"];
        let index = readlineSync.keyInSelect(options, "Transaction Menu: ".green);
        // prevents a 0 for being returned from option 1
        return index + 1;
    }

    /* Methods for Transaction menu items */

    displayBalance = (balance) => {
        console.log(`Your balance is ${this.money.format(balance)}`);
    }

    displayTransactions = (transactions) => {
        console.log("Time\t\t\t\tMessage\t\t\t\tBefore\t\tAmount\t\tAfter".green);
        for(let i = 0; i < transactions.length; i++) {
            let t = transactions[i]; // get the next transaction
            let date = dateFormat(t.time);
            console.log(`${date}\t${t.message}\t${t.previousBalance}\t\t${t.amount}\t\t${t.newBalance}`);
        }
    }

    // used to view a single transaction
    viewTransaction = (t) => {
        console.log("Transaction successful!\n".green);
        console.log("Time\t\t\t\tMessage\t\t\t\tBefore\t\tAmount\t\tAfter".green);
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
            console.log(`Account ID\tName\tEmail`.green);
            console.log(`${account.id}\t${account.name}\t${account.email}`);
        }
        let target = readlineSync.questionInt("Please enter an Account ID to transfer: ".blue);
        let amount = readlineSync.questionFloat("Amount to transfer: ".blue);
        while(amount <= 0) {
            amount = readlineSync.questionFloat("Please enter a positive value to transfer: ".red);
        }
        return {
            account: target,
            amount: amount
        }
    }

    // update the current account's pin
    newPin = () => {
        let oldPin = readlineSync.question("4-digit PIN: ".blue, {
            limit: /^[0-9]{4}$/,
            limitMessage: "Please input a 4-digit PIN.".red});
        // get the new PIN
        let validPin = false;
        let newPin = null;
        do {
            newPin = readlineSync.question("New 4-digit PIN: ".blue, {
                limit: /^[0-9]{4}$/,
                limitMessage: "Please input a 4-digit PIN.".red});
            let confirmPin = readlineSync.question("Confirm New PIN: ".blue);
            if(confirmPin === newPin) {
                validPin = true;
            }
            else {
                console.log("PIN does not match. Please try again.".red);
            }
        } while(!validPin);
        return {
            oldPin: oldPin,
            newPin: newPin
        };
    }

    withdraw = () => {
        let amount = readlineSync.questionFloat("Amount to withdraw: ".blue);
        while(amount <= 0) {
            amount = readlineSync.questionFloat("Please enter a positive value to withdraw: ".red);
        }
        return amount;
    }

    deposit = () => {
        let amount = readlineSync.questionFloat("Amount to deposit: ".blue);
        while(amount <= 0) {
            amount = readlineSync.questionFloat("Please enter a positive value to deposit: ".red);
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
        email = readlineSync.questionEMail("Email: ".blue);

        // get the name
        name = readlineSync.question("Name: ".blue);

        // get the PIN
        let validPin = false;
        do {
            pin = readlineSync.question("4-digit PIN: ".blue, {
                limit: /^[0-9]{4}$/,
                limitMessage: "Please input a 4-digit PIN.".red});
            let confirmPin = readlineSync.question("Confirm PIN: ".blue);
            if(confirmPin === pin) {
                validPin = true;
            }
            else {
                console.log("PIN does not match. Please try again.".red);
            }
        } while(!validPin);

        // get the initial balance
        initialBalance = readlineSync.question("Initial Balance(Format 00.00):".blue, {
            limit: /^[0-9]+\.[0-9]{2}$/,
            limitMessage: "Please input a valid dollar amount.".red
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