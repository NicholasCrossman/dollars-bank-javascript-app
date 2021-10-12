import readlineSync from 'readline-sync';

class application_views {

    constructor() {}

    initialPrompt = () => {
        console.log("Welcome to DollarsBank ATM!\n\n");

        const options = ['Transaction', 'New Account'];
        let index = readlineSync.keyInSelect(options, 'Please select an option:');
        return index + 1;        
    }

    newAccount = () => {
        console.log("New Account Creation!\n\nPlease enter the following information:\n");
        let email = "";
        let name = "";
        let pin = "";
        let initialBalance = 0;

        //get the email
        email = readlineSync.questionEMail("Email: ");
        //console.log("Received: " + email);

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
        initialBalance = readlineSync.question("Initial Balance:", {
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