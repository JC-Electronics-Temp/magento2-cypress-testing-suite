import "cypress-localstorage-commands";
import 'cypress-iframe';
import {Magento2RestApi} from './magento2-rest-api';

Cypress.Commands.addAll(Magento2RestApi)

Cypress.Commands.add('cookieButtonOKClick', (token) => {
	cy.get('#CybotCookiebotDialogBodyLevelButtonAccept').click();
});