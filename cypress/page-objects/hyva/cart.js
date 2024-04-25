import cart from '../../fixtures/hyva/selectors/cart.json';

export class Cart {
    static addProductToCart(url) {
        cy.visit(url);
		cy.get('#CybotCookiebotDialogBodyLevelButtonAccept').click();
        cy.get(cart.product.addToCartButton).click();
        cy.get(cart.product.messageToast)
            .should("include.text", "to your shopping cart")
            .should("be.visible");
    }

    static addCouponCode(couponCode) {
        cy.visit(cart.url.cartUrl);
        cy.get(cart.couponDropdownSelector).click();
        cy.get(cart.couponInputField).type(couponCode);
        cy.get(cart.addCouponButton).click();
    }

    static removeCoupon() {
        cy.visit(cart.url.cartUrl);
        cy.get(cart.couponDropdownSelector).click();
        cy.get(cart.addCouponButton).click({force: true});
    }
}
