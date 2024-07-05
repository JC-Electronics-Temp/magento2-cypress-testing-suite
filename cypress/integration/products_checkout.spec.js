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
        { loggedin: false },
        { loggedin: true }
    ];

    const orderTypes = [
        { type: 'repair', skipType: false, urgent: false },
        { type: 'cashback', skipType: false, urgent: false },
        { type: 'Refurbished', skipType: false, urgent: false },
        { type: 'Refurbished', skipType: false, urgent: true }
    ];

    const placeOrder = false;

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
                clients.forEach(({ loggedin }) => {
                    orderTypes.forEach(({ type, skipType, urgent }) => {
                        if (!skipType && !(!loggedin && paymentMethod === 'companycredit')) {
                            const loggedinLabel = loggedin ? 'acc' : 'guest';
                            const label = urgent ? `${loggedinLabel} !` : loggedinLabel;

                            it(`${paymentMethod} - ${type} - ${label}`, () => {
                                //cy.on('fail', (err, runnable) => {
                                //    console.log("*****Error");
                                //    console.log(err);
                                //    return false;
                                //});

                                const quantity_tested = urgent ? 0 : 1;

                                cy.getProduct(type, quantity_tested).then((sku) => {
                                    Catalog.addProductToCart(sku, type);

                                    if (loggedin) {
                                        Account.login(
                                            account.customer.customer.email,
                                            account.customer.password
                                        );
                                        cy.visit('/checkout');
                                        cy.get('.address-grid .address-item.active').should('exist');
                                    } else {
                                        cy.request("https://my.api.mockaroo.com/accdataoutsideeu.json?key=1fa729b0").then((response) => {
                                            cy.visit('/checkout');

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
                                        if (body.find('#payment-method-list li.active').length === 0) {
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

                                    let orderLabel = `Cprss: ${paymentLabel}-${type}-${label}`;
                                    if (urgent) {
                                        orderLabel += '!';
                                    }

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
