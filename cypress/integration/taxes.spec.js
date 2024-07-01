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
	describe('Create order', () => {
		beforeEach(() => {
			cy.setProductStock('6ES7134-6GD01-0BA1','New factory sealed',99, 9);
			cy.visit('/');
			cy.wait(2000);
			cy.cookieButtonOKClick();
		}):
		
		afterEach(() => {
			cy.wait(5000);
		}):
		
		const countries = [
		  { code: 'AT', percentage: 20, skip: true },
		  { code: 'BE', percentage: 21, skip: true },
		  { code: 'BG', percentage: 20, skip: true },
		  { code: 'CY', percentage: 19, skip: true },
		  { code: 'CZ', percentage: 21, skip: true },
		  { code: 'DE', percentage: 19, skip: true },
		  { code: 'DK', percentage: 25, skip: true },
		  { code: 'EE', percentage: 22, skip: true },
		  { code: 'ES', percentage: 21, skip: true },
		  { code: 'FI', percentage: 24, skip: true },
		  { code: 'FR', percentage: 20, skip: true },
		  { code: 'GR', percentage: 24, skip: true },
		  { code: 'HR', percentage: 25, skip: true },
		  { code: 'HU', percentage: 27, skip: true },
		  { code: 'IE', percentage: 23, skip: true },
		  { code: 'IT', percentage: 22, skip: true },
		  { code: 'LT', percentage: 21, skip: true },
		  { code: 'LU', percentage: 17, skip: true },
		  { code: 'MT', percentage: 18, skip: true },
		  { code: 'PL', percentage: 23, skip: true },
		  { code: 'PT', percentage: 23, skip: true },
		  { code: 'RO', percentage: 19, skip: true },
		  { code: 'SE', percentage: 25, skip: true },
		  { code: 'SK', percentage: 22, skip: false },
		  { code: 'SI', percentage: 22, skip: false }
		];
		
		const placeOrder = false;
		
		countries.forEach(({ code, percentage, skip }) => {
			if (!skip) {
				it(`Tax - ${code} ${percentage}%`, () => {
			
					var country = code;
					//cy.setProductStock('6ES7134-6GD01-0BA1','New factory sealed',99, 9);
					cy.request("https://my.api.mockaroo.com/users.json?key=1fa729b0").then((response) => {
						response.body.country = country;
						response.body.TaxVat = '';
						Catalog.addProductToCart('6ES7134-6GD01-0BA1', 'New factory sealed');
						cy.visit('/checkout');
						
						Checkout.enterShippingAddress(response.body);
						
						cy.get('.subtotal > .flex > .value').invoke('text').then((subtotalText) => {
						  const subtotal = parseFloat(subtotalText.replace(/[^\d.]/g, ''));
						  const expectedTax = (subtotal / 100) * percentage;

						  cy.get('.tax > .flex > .value').invoke('text').then((taxText) => {
							const tax = parseFloat(taxText.replace(/[^\d.]/g, ''));
							expect(expectedTax.toFixed(2)).to.equal(tax.toFixed(2));
						  });
						});
						
						if (placeOrder) {
						
							cy.get('body').then((body) => {
								if (body.find('#shipping-method-list li.active').length == 0) {
									cy.get('#shipping-method-list li').first().click();
									cy.get('.page-bottom #magewire-loader .animate-spin', { timeout: 10000 }).should('be.visible');
									cy.get('.page-bottom #magewire-loader .animate-spin', { timeout: 50000 }).should('not.be.visible');
								}
							});
							
							cy.get('button.btn-next').should('be.visible').click();
							
							cy.get('#magewire-loader .animate-spin', { timeout: 10000 }).should('be.visible');
							cy.get('#magewire-loader .animate-spin', { timeout: 60000 }).should('not.be.visible');
							
							cy.get('#payment-method-list li').first().click();
							
							cy.get('#magewire-loader .animate-spin', { timeout: 10000 }).should('be.visible');
							cy.get('#magewire-loader .animate-spin', { timeout: 60000 }).should('not.be.visible');

							cy.get('#purchase-order-number').clear().type('Cypress: tax '+country).blur();
							cy.get('#purchase-order-number-section header div span.flex svg', { timeout: 10000 }).should('be.visible');
						
							
							// Creditcard
							cy.get('#payment-method-option-adyen_cc', { timeout: 10000 }).click();
							cy.wait(5000);
							cy.frameLoaded('iframe[title="Iframe for card number"]');
							cy.iframe('iframe[title="Iframe for card number"]').find('[data-fieldtype="encryptedCardNumber"]', { timeout: 10000 }).should('be.visible', { timeout: 10000 }).type('4111 1111 4555 1142');
							
							cy.frameLoaded('iframe[title="Iframe for expiry date"]');
							cy.iframe('iframe[title="Iframe for expiry date"]').find('[data-fieldtype="encryptedExpiryDate"]').type('03/30');
							
							cy.frameLoaded('iframe[title="Iframe for security code"]');
							cy.iframe('iframe[title="Iframe for security code"]').find('[data-fieldtype="encryptedSecurityCode"]').type('737');
							
							cy.get('[name="holderName"]').type('J. Doe');
							
							cy.get('.btn-place-order').click();
						}
					});
				});
			}
		});
	});
}
