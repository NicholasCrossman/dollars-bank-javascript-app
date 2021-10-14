import application_views from './src/application_views.js';
import dollars_bank_atm from './src/dollars_bank_atm.js';

    let prompt = () => {
        let view = new application_views();
        let atm = new dollars_bank_atm();
        while(true) {
            let login_or_new_account = view.initialPrompt();
            if(login_or_new_account == 1) {
                console.log("Login selected.");
                let loggedIn = false;
                do {
                    let loginInfo = view.loginPrompt();
                    loggedIn = atm.login(loginInfo.email, loginInfo.pin);
                    if(!loggedIn) {
                        console.log("Email or PIN incorrect. Please try again.");
                    }
                } while (!loggedIn);
                // login successful. Proceed with transaction menu
                while(true) {
                    let selection = view.transaction();
                    switch (selection) {
                        case 1:
                            // return the account balance
                            view.displayBalance(atm.balance());
                            break;
                        case 2:
                            // print the last 5 transactions
                            let transactions = atm.fiveReventTransactions();
                            view.displayTransactions(transactions);
                            break;
                        case 3:
                            // update PIN
                            let pins = view.newPin();
                            let success = atm.updatePin(pins.oldPin, pins.newPin);
                            while(!success) {
                                console.log("Old pin is incorrect. Please try again.");
                                success = atm.updatePin(pins.oldPin, pins.newPin);
                            }
                            console.log("Pin successfully updated");
                            break;
                        case 4:
                            // withdraw amount
                            let withdrawl = view.withdraw();
                            let withdrawlReport = atm.withdrawl(withdrawl);
                            view.viewTransaction(withdrawlReport);
                            break;
                        case 5:
                            // deposit amount
                            let deposit = view.deposit();
                            let depositReport = atm.deposit(deposit);
                            view.viewTransaction(depositReport);
                            break;
                        case 6:
                            let accountsToTransfer = atm.allOtherAccounts();
                            let transfer = view.transfer(accountsToTransfer);
                            let transferSuccess = atm.transfer(transfer.account, transfer.amount);
                            while(!transferSuccess) {
                                // it failed, so prompt again
                                console.log("Transfer failed. This means your balance was insufficient, or " + 
                                " the target account cannot be found. Please try again: ");
                                transfer = view.transfer(accountsToTransfer);
                                transferSuccess = atm.transfer(transfer.account, transfer.amount);
                            }
                            // show the transaction
                            console.log("Transfer successful!");
                            let transferTransaction = atm.lastTransaction();
                            view.viewTransaction(transferTransaction);
                            break;
                        case 7:
                            //customer information
                            let info = atm.accountInfo();
                            view.viewAccount(info);
                            break;
                    
                        default:
                            break;
                        }
                }
                
            }
            else if(login_or_new_account == 2) {
                console.log("New Account selected.");
                // new account selected
                let newAccount = view.newAccount();
                let account = atm.addAccount(newAccount.email, newAccount.name, 
                    newAccount.pin, newAccount.initialBalance);

            }
        }
    }

    prompt();
    
