import selectors from '../../fixtures/hyva/selectors/account.json';
import productSelectors from '../../fixtures/hyva/selectors/product.json';
import account from '../../fixtures/account.json';

export class Account {
	constructor() {
		this.account.firstname = 'Jelle';
		this.account.lastname = 'Testma';
	}
	
	static fetchAccount() {
		cy.request({
			url: 'https://my.api.mockaroo.com/users.json?key=1fa729b0',
            method: 'GET',
			log: true,
			timeout: 20000	
		}).then((response) => {
			if (response.status === 200) {
				expect(response).to.have.property('status')
				var person = response.body;
				/*cy.get('[x-model="customer.customer_name"]').type(person.firstname + ' ' + person.lastname);
				cy.get('[x-model="customer.billing_company"]').type(person.company);
				cy.get('[x-model="customer.billing_company"]').type(person.company);
				cy.get('[x-model="customer.customer_email"]').type(person.email);
				//cy.get('[x-model="customer.billing_telephone"]').type(person.phone);
				cy.get('[x-model="customer.billing_telephone"]').type('514198765');
				*/
			}
		});
	}
	
	static enterAccountAddress(address) {
		
        cy.get(selectors.accountEmailInputSelector).type(address.email);
        cy.get(selectors.newPasswordInputSelector).type(address.password);
        cy.get(selectors.newPasswordConfirmationInputSelector).type(address.password);
		
		cy.get(selectors.accountFirstnameInputSelector).type(address.firstname);
        cy.get(selectors.accountLastnameInputSelector).type(address.lastname);
        cy.get(selectors.newAddressCityInput).type(address.city);
        cy.get(selectors.newAddressZipcodeInput).type(address.zipcode);
        cy.get(selectors.newAddressStreetInput).type(address.street);
        cy.get(selectors.newAddressStreet2Input).type(address.housenumber);
        //
        cy.get(selectors.newAddressCompanyInput).type(address.company);
        cy.get(selectors.newAddressPhoneInput).type(address.phone);
		
		
        cy.get(selectors.newAddressCountryInput).select(address.country);
        if (address.country === 'United States') {
            cy.get(selectors.newAddressRegionInput).type(address.region);
		}
		
		cy.get('body').then(($body) => {
			if ($body.find('#vat_id').length > 0) {
				if (address.TaxVat == 'default') {
					cy.get('#vat_id').type('NL858988069B01');
				} else {
					cy.get('#vat_id').type(address.TaxVat);
				}
				cy.get("#vat_id").blur();
			}
		});
    }
	
    static login(user, pw) {
        cy.visit(account.routes.accountIndex);
        cy.get(selectors.loginEmailInputSelector).type(user);
        cy.get(selectors.loginPasswordInputSelector).type(`${pw}{enter}`);
        this.isLoggedIn();
    }

    static isLoggedIn() {
        cy.get(selectors.accountMenuItems).contains('My Account')
    }

    static goToProfile() {
        cy.contains('Account Information').click();
    }

    static checkAllProfileSpecs() {
        cy.get(selectors.accountFirstnameInputSelector).should('be.visible');
        cy.get(selectors.accountLastnameInputSelector).should('be.visible');
        cy.contains('Change Email').should('be.visible').and('not.be.checked');
        cy.contains('Change Password')
            .should('be.visible')
            .and('not.be.checked');
    }

    static changePassword(pwd, newPwd) {
        cy.get(selectors.changePasswordFormSelector).within(($from) => {
            cy.contains('Change Password').click();
            cy.get(selectors.currentPasswordInputSelector).type(pwd);
            cy.get(selectors.newPasswordInputSelector).type(newPwd);
            cy.get(selectors.newPasswordConfirmationInputSelector).type(
                `${newPwd}{enter}`
            );
        });
    }

    static changeProfileValues(fn, ln) {
        cy.get('#form-validate').within(($form) => {
            cy.get(selectors.accountFirstnameInputSelector).clear().type(fn);
            cy.get(selectors.accountLastnameInputSelector)
                .clear()
                .type(`${ln}{enter}`);
        });
        cy.window().then((w) => (w.initial = true));
    }

    static logout() {
        cy.get(selectors.accountMenuIcon).click()
        cy.get(selectors.accountMenuItems)
            .contains('Sign Out')
            .click();
        return cy.get(selectors.accountMenuItems).contains('Sign In');
    }

    /** Create an address that is used with other tests */
    static createAddress(customerInfo) {
        cy.visit(account.routes.accountAddAddress);
        cy.get(selectors.addAddressFormSelector).then(($form) => {
            if ($form.find(selectors.defaultShippingAddress).length) {
                cy.get(selectors.defaultBillingAddress).check();
                cy.get(selectors.defaultShippingAddress).check();
            }
            cy.get(selectors.newAddressStreetInput).type(customerInfo.streetAddress);
            cy.get(selectors.newAddressStreet2Input).type(customerInfo.streetAddress);
            cy.get(selectors.newAddressCityInput).type(customerInfo.city);
            cy.get(selectors.newAddressPhoneInput).type(customerInfo.phone);
            cy.get(selectors.newAddressZipcodeInput).type(customerInfo.zip);
            cy.get(selectors.newAddressCountryInput).select(customerInfo.country);
            //cy.get(selectors.newAddressRegionInput).type(customerInfo.state);
            cy.contains('Save Address').click();
        });
    }

    static addItemToWishlist(itemUrl = '') {
        cy.visit(itemUrl);
        cy.get(productSelectors.addToWishlistButton).click();
    }
}
