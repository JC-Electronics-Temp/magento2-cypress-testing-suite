import account from '../fixtures/account.json';
import product from '../fixtures/hyva/product.json';
import checkout from '../fixtures/checkout.json';
import cart from '../fixtures/hyva/selectors/cart.json';
import selectors from '../fixtures/hyva/selectors/checkout.json';
import { Catalog } from '../page-objects/hyva/catalog';
import { Checkout } from '../page-objects/hyva/checkout';
import { Account } from '../page-objects/hyva/account';
import homepageSelectors from "../fixtures/hyva/selectors/homepage.json";
import { Magento2RestApi } from '../support/magento2-rest-api';

if (!Cypress.env('MAGENTO2_SKIP_CHECKOUT')) {
    const paymentMethods = [
        { paymentMethod: 'companycredit', percentage: 22, skip: false, paymentLabel: 'cmpcrdt' },
        { paymentMethod: 'banktransfer', percentage: 22, skip: false, paymentLabel: 'bnktrnsf' },
        { paymentMethod: 'adyen_hpp_ideal', percentage: 22, skip: false, paymentLabel: 'ideal' },
        { paymentMethod: 'adyen_cc', percentage: 22, skip: false, paymentLabel: 'crditcrd' }
    ];

    const clients = [
        { loggedin: false, skipLoggedin: false },
        { loggedin: true, skipLoggedin: false }
    ];

    const orderTypes = [
        { type: 'repair', skipType: false, urgent: false, typeLabel: 'rep' },
        { type: 'cashback', skipType: false, urgent: false, typeLabel: 'cb' },
        { type: 'Refurbished', skipType: false, urgent: false, typeLabel: 'ref' },
        { type: 'Refurbished', skipType: false, urgent: false, typeLabel: 'ref' }
    ];

    const placeOrder = true;

    paymentMethods.forEach(({ paymentMethod, skip, paymentLabel }) => {
        describe(`Create order with ${paymentMethod}`, () => {
            
			beforeEach(() => {
                cy.visit('/');
                cy.wait(1000);
                cy.cookieButtonOKClick();
            });

            afterEach(() => {
                cy.wait(5000);
            });

            if (!skip) {
                clients.forEach(({ loggedin, skipLoggedin }) => {
                    orderTypes.forEach(({ type, skipType, urgent, typeLabel }) => {
                        if (!skipType && !skipLoggedin && !(!loggedin && paymentMethod === 'companycredit')) {
                            const loggedinLabel = loggedin ? 'acc' : 'guest';
                            const label = urgent ? `${loggedinLabel} !` : loggedinLabel;

                            it(`${paymentMethod} - ${typeLabel} - ${label}`, () => {
								
								if (loggedin) {
									Account.login(
										account.customer.customer.email,
										account.customer.password
									);
									
									cy.visit('/checkout/cart');
													
                                    cy.get('body').then((body) => {
										if (body.find("tbody.cart tr").length > 0) {
										cy.get("tbody.cart tr").each(($row) => {
											console.log('click');
											cy.wrap($row).find("button.action-delete").trigger("click");
										});
										}
									});
								}
								

                                const quantity_tested = urgent ? 1 : 2;

                                cy.getProduct(type, 1).then((sku) => {
                                    Catalog.addProductToCart(sku, type);
									if (urgent) {
										Catalog.addProductToCart(sku, type);
									}
    
									cy.visit('/checkout');
									if (loggedin) {
                                        cy.get('.address-grid .address-item.active').should('exist');
                                    } else {
                                        cy.request("https://my.api.mockaroo.com/accdataoutsideeu.json?key=1fa729b0").then((response) => {

                                            if (paymentMethod == 'adyen_hpp_ideal') response.body.country = 'NL';
											cy.get('#guest_details-email_address').type(response.body.email);
                                            cy.get('#shipping-firstname').type(response.body.firstname);
                                            cy.get('#shipping-lastname').type(response.body.lastname);
                                            cy.get('#shipping-street-0').type(response.body.street);
                                            cy.get('#shipping-street-1').type(response.body.housenumber);
                                            cy.get('#shipping-postcode').type(response.body.zipcode);
                                            cy.get('#shipping-city').type(response.body.city);
                                            cy.get('#shipping-country_id').select(response.body.country);
                                            cy.get('#shipping-region').select(response.body.state);
                                            cy.get('#shipping-telephone').type(response.body.phone);
                                            cy.get('#shipping-company').type(response.body.company);
                                            //cy.get('#shipping-vat_id').type(response.body.TaxVat);
											//if (ideal) NL
                                        });
                                    }

                                    if (urgent) {
                                        cy.get('#urgent-handling').should('exist');
                                        cy.get('#urgent-handling').click();
                                        cy.get('#magewire-loader .animate-spin', { timeout: 10000 }).should('be.visible');
                                        cy.get('#magewire-loader .animate-spin', { timeout: 25000 }).should('not.be.visible');
                                    }

                                    cy.get('body').then((body) => {
                                        if (body.find('#shipping-method-list li.active').length === 0) {
                                            cy.get('#shipping-method-list li').first().click();
                                            cy.get('#magewire-loader .animate-spin', { timeout: 10000 }).should('be.visible');
                                            cy.get('#magewire-loader .animate-spin', { timeout: 25000 }).should('not.be.visible');
                                        }
                                    });

                                    cy.get('button.btn-next').should('be.visible').click();

                                    cy.get('#magewire-loader .animate-spin', { timeout: 10000 }).should('be.visible');
                                    cy.get('#magewire-loader .animate-spin', { timeout: 60000 }).should('not.be.visible');

                                    cy.get('body').then((body) => {
										if (type == 'cashback' && paymentMethod == 'banktransfer') {
											if (body.find(`li#payment-method-option-${paymentMethod}`).length == 0) {
												return;
											}
										}
                                        if (body.find(`li#payment-method-option-${paymentMethod}.active`).length !== 1) {
                                            cy.get(`#payment-method-option-${paymentMethod}`).click();
                                            cy.get('#magewire-loader .animate-spin', { timeout: 10000 }).should('be.visible');
                                            cy.get('#magewire-loader .animate-spin', { timeout: 60000 }).should('not.be.visible');
                                        }
                                    });

                                    if (paymentMethod === 'adyen_cc') {
                                        // Credit card
                                        cy.wait(5000);
                                        cy.frameLoaded('iframe[title="Iframe for card number"]');
                                        cy.iframe('iframe[title="Iframe for card number"]').find('[data-fieldtype="encryptedCardNumber"]', { timeout: 10000 }).should('be.visible', { timeout: 10000 }).type('4111 1111 4555 1142');

                                        cy.frameLoaded('iframe[title="Iframe for expiry date"]');
                                        cy.iframe('iframe[title="Iframe for expiry date"]').find('[data-fieldtype="encryptedExpiryDate"]').type('03/30');

                                        cy.frameLoaded('iframe[title="Iframe for security code"]');
                                        cy.iframe('iframe[title="Iframe for security code"]').find('[data-fieldtype="encryptedSecurityCode"]').type('737');

                                        cy.get('[name="holderName"]').type('J. Doe');
                                    } else if (paymentMethod === 'adyen_hpp_ideal') {
                                        cy.get('.adyen-checkout__dropdown__button').click();
                                        cy.get('#listItem-1154').click();
                                    }

                                    let orderLabel = `CPR: ${paymentLabel}-${typeLabel}-${label}`;

                                    cy.get('#purchase-order-number').clear().type(orderLabel).blur();
                                    cy.get('#purchase-order-number-section header div span.flex svg', { timeout: 10000 }).should('be.visible');

                                    if (placeOrder) {
                                        cy.get('.btn-place-order').click();
                                    }
                                    //cy.get('body', { timeout: 10000 }).should('have.class', 'checkout-onepage-success');
                                });
                            });
                        }
                    });
                });
            }
        });
    });
}
