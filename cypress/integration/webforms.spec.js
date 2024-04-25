import account from '../fixtures/account.json';
import product from '../fixtures/hyva/product.json';
import checkout from '../fixtures/checkout.json';
import cart from '../fixtures/hyva/selectors/cart.json';
import selectors from '../fixtures/hyva/selectors/checkout.json';
import { Catalog } from '../page-objects/hyva/catalog';
import { Checkout } from '../page-objects/hyva/checkout';
import { Account } from '../page-objects/hyva/account';
import homepageSelectors from "../fixtures/hyva/selectors/homepage.json";
import {Magento2RestApi} from '../support/magento2-rest-api';

if(! Cypress.env('MAGENTO2_SKIP_CHECKOUT')) {	
	describe('Webforms', () => {
		it('Quote request', () => {
			cy.getProduct('refurbished', 1).then((sku) => {
				Account.login(
					account.customer.customer.email,
					account.customer.password
				);
				cy.visit('/'+sku).then(($response) => {
					cy.get('#CybotCookiebotDialogBodyLevelButtonAccept').click();
					cy.get('.relative.text-sm > :nth-child(2)').click();
					cy.get('.request-quote-form [name="field[5]"]', { timeout: 10000 }).should('be.visible');
					cy.get('.request-quote-form [name="field[8]"]').type('2');
					cy.get('.request-quote-form [name="field[26]"]').type('Cypress quote test');
					cy.wait(2000);
					cy.get('.request-quote-form [name="field[17]"]').type('Awesome inc.');
					cy.wait(2000);
					cy.get('.request-quote-form [name="phonefield[23]"]').clear().type('514681989');
					cy.wait(2000);
					cy.get('.request-quote-form [name="field[403]"]').type('Cypress quote test');
					cy.get('.request-quote-form button[type="submit"]').click();
					cy.get('.request-quote-form .webforms-success-text').should('be.visible');
				});
			});
		});
    });
}
