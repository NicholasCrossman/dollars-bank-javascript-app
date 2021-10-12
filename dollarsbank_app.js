import application_views from './src/application_views.js';
import dollars_bank_atm from './src/dollars_bank_atm.js';

    let prompt = () => {
        let view = new application_views();
        let atm = new dollars_bank_atm();
        let transaction_or_new_account = view.initialPrompt();
        if(transaction_or_new_account == 1) {
            console.log("Transaction selected.");
            // transaction selected
            // TODO: show transaction screen
        }
        else if(transaction_or_new_account == 2) {
            console.log("New Account selected.");
            // new account selected
            let newAccountInfo = view.newAccount();
            console.log("New Account: " + JSON.stringify(newAccountInfo));
            // TODO: pass the new account on to the ATM

        }
    }

    prompt();
    
