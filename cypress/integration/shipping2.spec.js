import account from '../fixtures/account.json';
import product from '../fixtures/hyva/product.json';
import checkout from '../fixtures/checkout.json';
import cart from '../fixtures/hyva/selectors/cart.json';
import selectors from '../fixtures/hyva/selectors/checkout.json';
import { Catalog } from '../page-objects/hyva/catalog';
import { Checkout } from '../page-objects/hyva/checkout';
import { Account } from '../page-objects/hyva/account';
import homepageSelectors from "../fixtures/hyva/selectors/homepage.json";

const shippingData = {
    '> 10kg, € 2000 product': {
        product: '6SE7021-3EB20',
        countries: ["NL", "FR", "PL", "HU", "BG", "US", "VN"],
        standardCosts: ["€0.00", "€0.00", "€0.00", "€0.00", "€0.00", "€0.00", "€0.00"],
        standardMethods: ["ust01", "ust01", "ust01", "fec01", "fec02", "fec02", "fec02"],
        standardTimes: ["2", "2", "3", "3", "3", "5", "5"],
        expressCosts: ["€40.00", "€90.00", "€90.00", "€90.00", "€90.00", "€160.00", "€190.00"],
        expressMethods: ["usa01", "usa01", "usa01", "fed_e", "fed_e", "fed_e", "fed_e"],
        expressTimes: ["1", "1", "2", "2", "2", "3", "3"]
    },
    '< 10kg, € 500 product': {
        product: '6SE7018-0ES87-2DA0',
        countries: ["NL", "FR", "PL", "HU", "US", "VN"],
        standardCosts: ["€0.00", "€0.00", "€0.00", "€0.00", "€65.00", "€80.00"],
        standardMethods: ["ust01", "ust01", "ust01", "fec01", "fec02", "fec02"],
        standardTimes: ["2", "2", "3", "3", "5", "5"],
        expressCosts: ["€30.00", "€70.00", "€70.00", "€70.00", "€135.00", "€140.00"],
        expressMethods: ["usa01", "usa01", "usa01", "fed_e", "fed_e", "fed_e"],
        expressTimes: ["1", "1", "2", "2", "3", "3"]
    },
    '< 3kg, € 102 product': {
        product: '6AV3572-1FX00',
        countries: ["NL", "FR", "PL", "HU", "US", "VN"],
        standardCosts: ["€8.00", "€10.00", "€10.00", "€20.00", "€35.00", "€35.00"],
        standardMethods: ["ust01", "ust01", "ust01", "fec01", "fec02", "fec02"],
        standardTimes: ["2", "2", "3", "3", "5", "5"],
        expressCosts: ["€20.00", "€50.00", "€50.00", "€50.00", "€50.00", "€100.00"],
        expressMethods: ["usa01", "usa01", "usa01", "fed_e", "fed_e", "fed_e"],
        expressTimes: ["1", "1", "2", "2", "3", "3"]
    },
    '> 3kg < 10kg, € 102 product': {
        product: '6AV2100-0AA01-0AA0',
        countries: ["NL", "FR", "PL", "HU", "US", "VN"],
        standardCosts: ["€10.00", "€15.00", "€15.00", "€21.00", "€65.00", "€80.00"],
        standardMethods: ["ust01", "ust01", "ust01", "fec01", "fec02", "fec02"],
        standardTimes: ["2", "2", "3", "3", "5", "5"],
        expressCosts: ["€30.00", "€70.00", "€70.00", "€70.00", "€135.00", "€140.00"],
        expressMethods: ["usa01", "usa01", "usa01", "fed_e", "fed_e", "fed_e"],
        expressTimes: ["1", "1", "2", "2", "3", "3"]
    },
    '> 100kg, pallet product': {
        product: '6se7032-1tg60',
        countries: ["NL", "FR", "PL", "HU", "US", "VN"],
        standardCosts: ["€250.00", "€275.00", "€275.00", "€350.00", "€1,200.00", "€1,300.00"],
        standardMethods: ["cec01", "cec01", "cec01", "cec01", "fef01", "fef01"],
        standardTimes: ["5", "5", "5", "5", "5", "8"],
        expressCosts: ["€450.00", "€750.00", "€750.00", "€975.00", "€1,800.00", "€1,900.00"],
        expressMethods: ["fpf01", "fpf01", "fpf01", "fpf01", "fpf01", "fpf01"],
        expressTimes: ["3", "3", "3", "3", "3", "5"]
    },
    '< 100kg, pallet product': {
        product: '6SE7031-2EF70',
        countries: ["NL", "FR", "PL", "HU", "US", "VN"],
        standardCosts: ["€150.00", "€175.00", "€175.00", "€250.00", "€750.00", "€900.00"],
        standardMethods: ["cec01", "cec01", "cec01", "cec01", "fef01", "fef01"],
        standardTimes: ["5", "5", "5", "5", "5", "8"],
        expressCosts: ["€350.00", "€600.00", "€600.00", "€600.00", "€1,400.00", "€1,400.00"],
        expressMethods: ["fpf01", "fpf01", "fpf01", "fpf01", "fpf01", "fpf01"],
        expressTimes: ["3", "3", "3", "3", "3", "5"]
    }
};

describe('Shipping costs', () => { 
    Object.entries(shippingData).forEach(([testName, details]) => {
        it(`Shipping: ${testName}`, () => {
            Catalog.addProductToCart(details.product, 'Refurbished');
            cy.visit('/checkout');
            const countrySelect = cy.get('#shipping-country_id');
            let i = 0;
            details.countries.forEach(country => {
                let methods = 2;
                let method = 0;
                countrySelect.select(country);
                cy.get('#magewire-loader .animate-spin', { timeout: 5000 }).should('be.visible');
                cy.get('#magewire-loader .animate-spin', { timeout: 10000 }).should('not.be.visible');
                if (country === "NL" || country === "FR") {
                    // Custom logic for specific countries
                }
                cy.get('#shipping-method-list li').should('have.length', methods);
                cy.get('#shipping-method-list label').eq(method).find('div').eq(3).contains(details.standardCosts[i]);
                cy.get(`#shipping-method-option-${details.standardMethods[i]}`).should('exist');
                cy.get(`#shipping-method-option-${details.standardMethods[i]} .text-sm`).should('include.text', `, ${details.standardTimes[i]} working day`);
                method++;
                cy.get('#shipping-method-list label').eq(method).find('div').eq(3).contains(details.expressCosts[i]);
                cy.get(`#shipping-method-option-${details.expressMethods[i]}`).should('exist');
                cy.get(`#shipping-method-option-${details.expressMethods[i]} .text-sm`).should('include.text', `, ${details.expressTimes[i]} working day`);
                i++;
            });
        });
    });
});

describe('Checkout tests', () => {
    it.skip('Set Product Stocks', () => {
        cy.setProductStock('6AV6641-0CA01-0AX1', 'Refurbished', 5, 1);
    });

    it('Can see the correct product price and shipping costs', () => {
        Checkout.addProductToCart('/6AV6641-0CA01-0AX1', 'Refurbished');
        cy.get(selectors.productPrice).then(($PDPprice) => {
            const PDPPrice = $PDPprice[0].innerText.trim();
            cy.visit(checkout.checkoutUrl);
            Checkout.enterShippingAddress(checkout.shippingAddress);
            cy.get('.justify-around > .btn').click();
            cy.get('.flex > .mt-2 > .inline-block').click();
            cy.get(selectors.checkoutSubtotalPrice).then(($checkoutPrice) => {
                const checkoutPrice = $checkoutPrice[0].innerText.trim();
                expect($checkoutPrice[0].innerText.trim()).to.equal(PDPPrice);
                expect(/\$\d+\.\d{2}/.test($checkoutPrice[0].innerText.trim())).to.be.true;
                cy.get(selectors.checkoutShippingPrice).then(($shippingPrice) => {
                    const shippingPrice = $shippingPrice[0].innerText.trim();
                    expect(/\$\d+\.\d{2}/.test(shippingPrice)).to.be.true;
                    cy.get('.mt-3 > .flex > :nth-child(2)').then(($totalPrice) => {
                        const totalPrice = $totalPrice[0].innerText.trim();
                        expect(/\$\d+\.\d{2}/.test(totalPrice)).to.be.true;
                        expect(+checkoutPrice.slice(1) + +shippingPrice.slice(1)).to.equal(+totalPrice.slice(1));
                    });
                });
            });
        });
    });
});
