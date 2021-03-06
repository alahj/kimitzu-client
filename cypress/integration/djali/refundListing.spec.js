/// <reference types="Cypress" />
/* global context, cy, Cypress */

import Initialize from "../../support/utils/Initialize"

context('Refund Listing', () => {
  beforeEach(() => {
    cy.server({})

    Initialize(cy)

    cy.route({
      method: 'GET',
      url: 'http://localhost:8100/ob/exchangerate/btc',
      response: {}
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:8100/ob/moderators?async=true',
      response: {}
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:8109/kimitzu/peer/*',
      response: 'fixture:profile/refunding_seller.json',
    })
    //Important to include this route based on the peerID on the refunding_seller.json
    cy.route({
      method: 'GET',
      url: 'http://localhost:8109/kimitzu/peer/get?id=PeerOfSellerThatCanRefund',
      response: {},
    })
    //Important to include this route based on the buyerID.peerID on the order_to_be_refunded.json
    cy.route({
      method: 'GET',
      url: 'http://localhost:8109/kimitzu/peer/get?id=PeerOfBuyer',
      response: {},
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:8109/authenticate',
      response: {
        authenticated: false
      },
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:8100/ob/chatconversations',
      response: [],
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:8100/ob/chatmessages?limit&offsetId&subject=sampleOrderToBeRefunded',
      response: [],
    })
    cy.route({
      method: 'GET',
      url: ' http://localhost:8100/ob/settings',
      response: 'fixture:settings/primary.json',
    })
    cy.route({
      method: 'POST',
      url: 'http://localhost:8100/ob/refund',
      response: {},
    }).as('refundOrder')
    cy.visit('http://localhost:3000/#/history/sales/sampleOrderToBeRefunded')
  })

  it('should verify refund order request', () => {
    cy.route({
      method: 'GET',
      url: 'http://localhost:8100/ob/order/sampleOrderToBeRefunded',
      response: 'fixture:orders/order_to_be_refunded.json',
    })

    cy.get('#js-modal-prompt')
      .contains('Refund')

    cy.get('#js-modal-prompt')
      .click()
    cy.get('.uk-input')
      .type('Sample Memo To Refund an Order.')
    cy.get('.uk-modal-footer > .uk-button-primary')
      .click()

    cy.wait('@refundOrder').then((xhr) => {
      expect(xhr.requestBody.memo).to.equal('Sample Memo To Refund an Order.')
      expect(xhr.requestBody.orderId).to.equal('QmeYt71uC13xdbZwsKvZdDiG5aGaTwFVHZqE1mofqEdzAB')
    })
  })

  it('should display the values a refunded order', () => {
    cy.route({
      method: 'GET',
      url: 'http://localhost:8100/ob/order/sampleOrderToBeRefunded',
      response: 'fixture:orders/refunded_order.json',
    })

    cy.get(':nth-child(7)')
      .should('have.class', 'stepperCircle')
    cy.get('#contentContainerMain > :nth-child(7)')
      .should('have.html', 'Refunded')
    cy.get(':nth-child(2) > :nth-child(1) > .uk-margin-small-bottom > .uk-text-bold')
      .should('have.html', 'Refunded')
  })

})