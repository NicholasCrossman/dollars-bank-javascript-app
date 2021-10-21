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

    /**
     * This is the initial prompt when the application is started. 
     * It asks the user if they want to login or create a new account, and returns an integer 
     * value: 1 for Login, and 2 for New Account.
     * @returns int - 1 if the user selects "Login", and 2 if the user selects "New Account".
     */
    initialPrompt = () => {
        console.log("Welcome to DollarsBank ATM!\n\n".green);

        const options = ['Login', 'New Account'];
        let index = readlineSync.keyInSelect(options, 'Please select an option: '.green);
        // prevents a 0 for being returned from option 1
        return index + 1;        
    }

    /**
     * This prompts the user to login to an existing account with an email and account PIN.
     * It returns an object containing the login info.
     * @returns Object - Returns an object containing the email and pin from the user's 
     *          login attempt.
     */
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

    /**
     * Displays the main menu of possible transactions, used after the user 
     * has logged in.
     * @returns int - An index for the user's selection.
     *              1 - Account Balance Check
     *              2 - Print Transactions
     *              3 - Update PIN
     *              4 - Withdraw Amount
     *              5 - Deposit Amount
     *              6 - Transfer
     *              7 - Customer Information
     */
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

    /**
     * Displays the user's current account balance.
     * @param float - The account's balance. 
     */
    displayBalance = (balance) => {
        console.log(`Your balance is ${this.money.format(balance)}`);
    }

    /**
     * Displays the user's transactions. This is used for the lastFiveTransactions() 
     * method, so it will be used to show 5 or fewer transactions.
     * An account will always have an Initial Balance transaction.
     * @param List[] - transactions - The user's transactions.
     */
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

    /**
     * Used to transfer money from the user's account to another account. 
     * This will print out a list of all accounts in the system, and prompt 
     * the user to type in the ID of the destination account, as well as the amount 
     * to be transferred. Returns an object with the account ID and amount.
     * @param List[] accounts - A collection of all accounts in the system.
     * @returns Object - An object containing the destination account and amount input 
     *                  by the user.
     */
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

    /**
     * Allows the user to update the PIN of their current account. This requires the 
     * user to input the old pin as validation. This will also ask the user to type 
     * in the pin again to confirm the new pin, and reject pins of the wrong size or format. 
     * Returns the new pin.
     * @returns int - A 4-digit PIN input by the user.
     */
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

    /**
     * Allows the user to withdraw money from their account. This requires a positive 
     * value to be entered. It returns the amount input by the user.
     * @returns float - The amount to withdraw.
     */
    withdraw = () => {
        let amount = readlineSync.questionFloat("Amount to withdraw: ".blue);
        while(amount <= 0) {
            amount = readlineSync.questionFloat("Please enter a positive value to withdraw: ".red);
        }
        return amount;
    }

    /**
     * Allows the user to make a deposit into their account. A positive value must be entered. 
     * It returns the input amount.
     * @returns float - The amount to deposit.
     */
    deposit = () => {
        let amount = readlineSync.questionFloat("Amount to deposit: ".blue);
        while(amount <= 0) {
            amount = readlineSync.questionFloat("Please enter a positive value to deposit: ".red);
        }
        return amount;
    }

    /**
     * Prompts the user to create a new account. This asks the user for an email, name, 
     * pin, and initial balance. Each of these is checked for the correct format. The initial 
     * balance must be positive. It returns an object containing all of the input values.
     * @returns Object - An object containing the email, name, pin, and initial balance of the 
     *                  new account.
     */
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