import homepage from '../../fixtures/hyva/homepage.json';
import selectors from '../../fixtures/hyva/selectors/homepage.json';
import searchSelectors from '../../fixtures/hyva/selectors/search.json';
import product from '../../fixtures/hyva/product.json';
import account from '../../fixtures/account.json';
import cart from "../../fixtures/hyva/selectors/cart.json";
import {Account} from '../../page-objects/hyva/account';

describe('RMA form', () => {
    beforeEach(() => {
        cy.visit('de/returns');
		cy.cookieButtonOKClick();
    });

    it('Fill in RMA form and submit', () => {
		//var person = Account;
		Account.fetchAccount();
				cy.get('[x-model="customer.customer_name"]').type(Account.firstname + ' ' + Account.lastname);
				cy.get('[x-model="customer.billing_company"]').type(Account.company);
				cy.get('[x-model="customer.billing_company"]').type(Account.company);
				cy.get('[x-model="customer.customer_email"]').type(Account.email);
				//cy.get('[x-model="customer.billing_telephone"]').type(Account.phone);
				cy.get('[x-model="customer.billing_telephone"]').type('514198765');
			
		//});
		
		cy.get('[data-direction="next"]').click();
		
		cy.get('[name="field[429]"]').type('Test JK');
		cy.get('[name="field[432]"]').select('Reparatur im Rahmen der Garantie');
		
		cy.get('[data-direction="next"]').click();
		
		cy.get('.type-returnProductField table tbody tr').should('be.visible').eq(0).should('be.visible').find('td').eq(0).find('input').type('Test JK');
		cy.get('.type-returnProductField table tbody tr').should('be.visible').eq(0).find('td').eq(1).find('input').type('Test JK');
		cy.get('.type-returnProductField table tbody tr').should('be.visible').eq(0).find('td').eq(2).find('input').type('Test JK');
		
		cy.get('tfoot > tr > td > .btn').click();
		
		cy.get('.type-returnProductField table tbody tr').should('be.visible').eq(1).should('be.visible').find('td').eq(0).find('input').type('Test JK');
		cy.get('.type-returnProductField table tbody tr').should('be.visible').eq(1).find('td').eq(1).find('input').type('Test JK');
		cy.get('.type-returnProductField table tbody tr').should('be.visible').eq(1).find('td').eq(2).find('input').type('Test JK');
		
		//cy.get('.webforms-hyva form .step-footer button[type="submit"]').click();
		
		// final click
		
    });
});
