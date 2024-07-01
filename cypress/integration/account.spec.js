import {Account} from '../page-objects/hyva/account';
import {Magento2RestApi} from '../support/magento2-rest-api';
import account from '../fixtures/account.json';
import product from '../fixtures/hyva/product.json';
import checkout from '../fixtures/checkout.json';
import selectors from '../fixtures/hyva/selectors/account.json';
import checkoutSelectors from '../fixtures/hyva/selectors/checkout.json';
import productSelectors from '../fixtures/hyva/selectors/product.json';
import homepageSelectors from '../fixtures/hyva/selectors/homepage.json'
import cart from "../fixtures/hyva/selectors/cart.json";
import {Cart} from "../page-objects/hyva/cart";

describe(['hot'], 'Account test creation NL', () => {
    it.skip('Can create an account', () => {
        cy.request("https://my.api.mockaroo.com/users.json?key=1fa729b0").then((response) => {
			cy.visit(account.routes.accountCreate);
			
			Account.enterAccountAddress(response.body);
		
			//validate vat number
			//cy.get('.vat_id .w-full', { timeout: 10000 }).should('be.visible');
			//cy.get('.vat_id .w-full', { timeout: 10000 }).should('not.be.visible');
			cy.get('form.form-create-account button[type=submit]').click();
			cy.location('pathname', {timeout: 100000})
				.should('include', '/customer/account');
			cy.contains(
				'Thank you for registering with JC-Electronics.'
			).should('exist');
		}
    });
});

describe(['hot'], 'Account test creation World', () => {
    it.only('Can create an account', () => {
        cy.request("https://my.api.mockaroo.com/accdataoutsideeu.json?key=1fa729b0").then((response) => {
			cy.visit(account.routes.accountCreate);
			
			Account.enterAccountAddress(response.body);
		
			//validate vat number
			//cy.get('.vat_id .w-full', { timeout: 10000 }).should('be.visible');
			//cy.get('.vat_id .w-full', { timeout: 10000 }).should('not.be.visible');
			cy.get('form.form-create-account button[type=submit]').click();
			cy.location('pathname', {timeout: 100000})
				.should('include', '/customer/account');
			cy.contains(
				'Thank you for registering with JC-Electronics.'
			).should('exist');
		}
    });
});

describe(['hot'], 'Account activities', () => {

    beforeEach(() => {
        Account.login(
            account.customer.customer.email,
            account.customer.password
        );
        // If login fails the assertion is ignored without the wait(0)
        cy.wait(0);
        cy.contains('Please wait and try again later.').should('not.exist');
    });
/*
    after(() => {
        // Remove the added address
        cy.visit(account.routes.accountUrl);
        cy.get('#maincontent').then(($mainContent) => {
            if (
                $mainContent[0].querySelector('h1') &&
                $mainContent[0].querySelector('h1').innerText.trim() !==
                'My Account'
            ) {
                Account.login(
                    account.customer.customer.email,
                    account.customer.password
                );
            }
        });
        cy.visit('/customer/address');
        cy.get('a.delete').eq(0).click();
        cy.on('window:confirm', (str) => {
            expect(str.trim()).to.eq(
                'Are you sure you want to delete this address?'
            );
            return true;
        });
    });
*/
    it('Can use API to login', () => {
        // @TODO As of yet quite useless
        Magento2RestApi.logCustomerIn(account.customerLogin);
    });

    it('Can check your profile', () => {
        cy.visit(account.routes.accountEdit);
        Account.checkAllProfileSpecs();
    });

    it.skip('Can change password', () => {
        cy.visit(account.routes.accountEdit);
        cy.contains('Change Password').click();
        cy.contains('Current Password').should('be.visible');
        cy.contains('New Password').should('be.visible');
        cy.contains('Change Password').click();
        Account.changePassword(
            account.customer.password,
            account.tempCustomerInfo.password
        );
        cy.contains('You saved the account information.').should('exist');
        Account.login(
            account.customer.customer.email,
            account.tempCustomerInfo.password
        );
        cy.visit(account.routes.accountEdit);
        // Change password back to normal
        Account.changePassword(
            account.tempCustomerInfo.password,
            account.customer.password
        );
        cy.contains('You saved the account information.').should('exist');
    });

    it.skip('Can change the profile values', () => {
        let fn = account.tempCustomerInfo.firstname,
            ln = account.tempCustomerInfo.lastname;
        cy.visit(account.routes.accountEdit);
        Account.changeProfileValues(
            account.tempCustomerInfo.firstname,
            account.tempCustomerInfo.lastname
        );
        Account.goToProfile();
        cy.get(selectors.accountFirstnameInputSelector).should(
            'have.value',
            fn
        );
        cy.get(selectors.accountLastnameInputSelector).should('have.value', ln);
        cy.visit(account.routes.accountEdit).then(() => {
            let fn = account.customer.customer.firstname,
                ln = account.customer.customer.lastname;
            Account.changeProfileValues(fn, ln);
            cy.visit(account.routes.accountEdit).then(() => {
                cy.get(selectors.accountFirstnameInputSelector).should(
                    'have.value',
                    fn
                );
                cy.get(selectors.accountLastnameInputSelector).should(
                    'have.value',
                    ln
                );
            });
        });
    });

    it('Can view order history', () => {
        // Testing the link has already been done
        cy.visit(account.routes.accountOrderHistory);
		cy.get('#my-orders-table > div').its('length').then((size) => {
			cy.log('Length is '+size);
			if (size < 0) {
				cy.contains('You have placed no orders.').should('exist');
			}
		});
    });

    it('Can add an address', () => {
        cy.visit(account.routes.accountAddAddress);
        Account.createAddress(account.customerInfo);
        cy.contains(selectors.addNewAddressButton, 'Save Address').click();
        cy.get(selectors.newAddressStreetInput).type(
            account.customerInfo.streetAddress
        );
        cy.get(selectors.newAddressCityInput).type(account.customerInfo.city);
        cy.get(selectors.newAddressPhoneInput).type(account.customerInfo.phone);
        cy.get(selectors.newAddressZipcodeInput).type(account.customerInfo.zip);
        cy.get(selectors.newAddressCountryInput).select(
            account.customerInfo.country
        );
        //cy.get(selectors.newAddressRegionInput).type(
        //    account.customerInfo.state
        //);
        cy.get(selectors.newAddressBillingInput).check();
        cy.get(selectors.newAddressShippingInput).check();
        cy.contains('Save Address').click();
    });

    it('Can change an address', () => {
        const timeStamp = Date.now().toString();
        cy.visit(account.routes.accountAddresses);
        cy.get(selectors.editAddress).first().click();
        cy.get(selectors.addressEditStreetInput).eq(0).type(timeStamp);
        cy.get(selectors.saveAddressButton).contains('Save Address').click();
        cy.contains('You saved the address.').should('exist');
    });

    if (!Cypress.env('MAGENTO2_SKIP_CHECKOUT')) {
        it("Can add an address automatically from saved address'", () => {
            // There needs to be a saved address for this test to work,
            // TODO: add an "Account.addAddress()" method to the Account page-object
            cy.visit(product.simpleProductUrl);
            cy.contains('Add to Cart').click();
            cy.visit(checkout.checkoutUrl);
            cy.wait(1000); // this shouldn't be needed but for some reason it doesn't work without
            cy.get(
                '[id^="additional.shipping_address_selected_other_option_"]'
            ).should('have.length.above', 1);
        });
    }

    it('Can remove an address', () => {
        Account.createAddress(account.customerInfo);
        cy.visit(account.routes.accountAddresses);
        cy.get(selectors.deleteAddressButton).last().click();
        // An confirm alert pops up asking if you are sure
        cy.on('window:confirm', (str) => {
            expect(str.trim()).to.eq(
                'Are you sure you want to delete this address?'
            );
            return true;
        });
        cy.contains('You deleted the address.').should('exist');
    });

    it('Can change the newsletter subscription', () => {
        cy.visit(account.routes.manageNewsletter);
        cy.contains('General Subscription').click();
        cy.get(selectors.subscriptionSaveButton).click();
        cy.get(homepageSelectors.successMessage).should('include.text', 'We have ');
    });

    it('Can log out', () => {
        cy.get(selectors.accountIcon).click();
        cy.get(selectors.accountMenuItems).contains('Sign Out').click();
        cy.get(homepageSelectors.mainHeading).should(
            'contain.text',
            'You have signed out'
        );
    });
});

describe('Customer cart', () => {
    // This test is in this file because it depends on the customer account fixture created by this spec
    it("Merges an already existing cart when a customer logs in", () => {
        Cart.addProductToCart(cart.url.product1Url);
        cy.visit(cart.url.cartUrl);
        cy.get(cart.productNameInCart).invoke('text').then(productName => {
            Account.login(account.customerLogin.username, account.customerLogin.password)
            cy.visit(cart.url.cartUrl);
            cy.get(cart.productNameInCart).should('have.text', productName)
        })
        Account.logout();
    });
})

describe(['hot'], 'Guest user test', () => {
    it('Can login from cart', () => {
        cy.visit(product.simpleProductUrl);
        cy.get(checkoutSelectors.addToCartButton).click();
        cy.get(selectors.successMessageCartLink)
            .contains('shopping cart')
            .click();
        cy.visit(account.routes.accountIndex);
        Account.login(
            account.customer.customer.email,
            account.customer.password
        );
        // If the login fails the test will still pass without this line
        cy.get(selectors.messageContents).should('not.exist');
        cy.get(checkoutSelectors.miniCartIcon).click();
        cy.get(checkoutSelectors.cartDrawerEditLink)
            .contains('View and Edit Cart')
            .click();
        cy.get(checkoutSelectors.productQuantityField).and(($input) => {
            // Could pass when I should fail?
            expect($input[0].valueAsNumber).to.be.at.least(1);
        });
        cy.contains(product.simpleProductName).should('exist');
    });

    if (!Cypress.env('MAGENTO2_SKIP_CHECKOUT')) {
        it('Can login from checkout', () => {
            cy.visit(product.simpleProductUrl);
            cy.get(checkoutSelectors.addToCartButton)
                .should('contain.text', 'Add to Cart')
                .click();
            cy.visit(checkout.checkoutUrl, {timeout: 5000});
            cy.get(checkoutSelectors.checkoutLoginToggle).click();
            cy.get(checkoutSelectors.checkoutEmailLabel)
                .click()
                .type(account.customer.customer.email);
            cy.get(checkoutSelectors.checkoutPasswordLabel)
                .click()
                .type(account.customer.password);
            cy.get(checkoutSelectors.checkoutLoginButton).click();
            cy.get(checkoutSelectors.checkoutLoggedInEmail).should(
                'contain.text',
                account.customer.customer.email
            );
            cy.get('.message span').should('not.exist');
        });
    }
});