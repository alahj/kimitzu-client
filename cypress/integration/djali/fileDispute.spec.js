/// <reference types="Cypress" />
/* global context, cy, Cypress */

import WebSocketMock from "../../support/utils/WebSocketMock"
import { WebSocket } from 'mock-socket';
import Initialize from "../../support/utils/Initialize";

let webSocketMock = new WebSocketMock('ws://localhost:8100/ws')

context('File Dispute', () => {
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
      response: 'fixture:profile/vendor.json',
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
      url: ' http://localhost:8100/ob/settings',
      response: 'fixture:settings/primary.json',
    })
    cy.route({
      method: 'GET',
      url: 'http://localhost:8100/ob/*',
      response: [],
    })
    cy.route({
      method: 'POST',
      url: 'http://localhost:8100/ob/opendispute',
      response: [],
    }).as('OpenDispute')

    cy.route({
      method: 'POST',
      url: 'http://localhost:8100/ob/groupchat',
      response: {}
    }).as('sendDiscussionMsg')

    cy.visit('http://localhost:3000/#/history/purchases/sample_order', {
      onBeforeLoad(win) {
        cy.stub(win, "WebSocket", url => new WebSocket('ws://localhost:8100/ws'))
      }
    })
  })

  it('should display chat box information', () => {
    cy.route({
      method: 'GET',
      url: 'http://localhost:8100/ob/order/sample_order',
      response: 'fixture:orders/resolved_disputed_order.json'
    })

    cy.get('#desktop-discussion > .list-item').click()
    cy.get('#full-size > #messages-display-main > #messages-chat-cont > #message-input-cont > .message-input')
      .type('A Sample Discussion Message to send')
    cy.get('#img-send')
      .click()

    cy.wait('@sendDiscussionMsg').then((xhr) => {
      expect(xhr.requestBody.processedMessage).to.equal('A Sample Discussion Message to send')
      expect(xhr.requestBody.outgoing).to.equal(true)
    })

    setTimeout(() => {
      webSocketMock.sendMsg(`{"message":
        {
          "message":"A Sample Discussion Message that Responds",
          "messageId":"QmT3WwLjh6f9jkAJFM1GN7Udo8R8tAKwcL7LTRNTvM6RAu",
          "outgoing":false,
          "peerId":"QmYuz7HMF5SDMKjyUj3zCTqiq2rhAkWpDoxjhre8MLiHPN",
          "read":false,
          "subject":"sample_order",
          "timestamp":"2019-10-09T19:04:29.7451483+08:00"
        }
      }`)
    }, 5000)

    cy.contains('A Sample Discussion Message that Responds')
  })

  it('should successfully file a dispute', () => {
    cy.route({
      method: 'GET',
      url: 'http://localhost:8100/ob/order/sample_order',
      response: 'fixture:orders/awaiting_fulfillment_order.json'
    })

    cy.get('#kimitzu-btn').click()
    cy.get('.uk-textarea')
      .type('Typing a suitable claim with the most relevant evidence')
    cy.get('#kimitzu-btn').click()

    cy.get('.uk-notification-message > div')
      .contains('Dispute Sent!')

    cy.wait('@OpenDispute').then((xhr) => {
      expect(xhr.requestBody.claim).to.equal('Typing a suitable claim with the most relevant evidence')
    })
  })

  it('should correctly display details of an ongoing disputed order', () => {
    cy.route({
      method: 'GET',
      url: 'http://localhost:8100/ob/order/sample_order',
      response: 'fixture:orders/ongoing_disputed_order.json'
    })

    cy.get('#contentContainerMain > :nth-child(1)').should('have.html', 'Disputed')
    cy.get('#stepperMain > :nth-child(1)').should('have.class', 'stepperCircle')

    cy.get('#contentContainerMain > :nth-child(3)').should('have.html', 'Decided')
    cy.get('#stepperMain > :nth-child(3)').should('have.class', 'stepperCircleInactiveNormal')

    cy.get('#contentContainerMain > :nth-child(5)').should('have.html', 'Resolved')
    cy.get('#stepperMain > :nth-child(5)').should('have.class', 'stepperCircleInactive')

    cy.contains('The order is being disputed')

    cy.contains('October 09, 9999')
    cy.contains('October 09, 9999')
  })

  it('should correctly display details of an expired disputed order', () => {
    cy.route({
      method: 'GET',
      url: 'http://localhost:8100/ob/order/sample_order',
      response: 'fixture:orders/expired_disputed_order.json'
    })

    cy.get('#contentContainerMain > :nth-child(1)').should('have.html', 'Disputed')
    cy.get('#stepperMain > :nth-child(1)').should('have.class', 'stepperCircle')

    cy.get('#contentContainerMain > :nth-child(3)').should('have.html', 'Expired')
    cy.get('#stepperMain > :nth-child(3)').should('have.class', 'stepperCircle')

    cy.get('#contentContainerMain > :nth-child(5)').should('have.html', 'Decided')
    cy.get('#stepperMain > :nth-child(5)').should('have.class', 'stepperCircleInactiveNormal')

    cy.get('#contentContainerMain > :nth-child(7)').should('have.html', 'Resolved')
    cy.get('#stepperMain > :nth-child(7)').should('have.class', 'stepperCircleInactive')

    cy.contains('Dispute Expired')

    // cy.contains('October 09, 2000 11:18:34 am')
    // cy.contains('October 09, 2000 10:59:00 am')
    // Disable HH:MM:SS timestamp for the time being
    // TODO: align PH time with CI time

    cy.contains('October 09, 2000')
    cy.contains('October 09, 2000')
  })

  it('should correctly display details of a decided disputed order', () => {
    cy.route({
      method: 'GET',
      url: 'http://localhost:8100/ob/order/sample_order',
      response: 'fixture:orders/decided_disputed_order.json'
    })

    cy.get('#contentContainerMain > :nth-child(1)').should('have.html', 'Disputed')
    cy.get('#stepperMain > :nth-child(1)').should('have.class', 'stepperCircle')

    cy.get('#contentContainerMain > :nth-child(3)').should('have.html', 'Decided')
    cy.get('#stepperMain > :nth-child(3)').should('have.class', 'stepperCircle')

    cy.get('#contentContainerMain > :nth-child(5)').should('have.html', 'Resolved')
    cy.get('#stepperMain > :nth-child(5)').should('have.class', 'stepperCircleInactive')

    cy.get('#kimitzu-btn').contains('Release Funds')
  })

  it('should correctly display details of a resolved disputed order', () => {
    cy.route({
      method: 'GET',
      url: 'http://localhost:8100/ob/order/sample_order',
      response: 'fixture:orders/resolved_disputed_order.json'
    })

    cy.get('#contentContainerMain > :nth-child(1)').should('have.html', 'Disputed')
    cy.get('#stepperMain > :nth-child(1)').should('have.class', 'stepperCircle')

    cy.get('#contentContainerMain > :nth-child(3)').should('have.html', 'Decided')
    cy.get('#stepperMain > :nth-child(3)').should('have.class', 'stepperCircle')

    cy.get('#contentContainerMain > :nth-child(5)').should('have.html', 'Resolved')
    cy.get('#stepperMain > :nth-child(5)').should('have.class', 'stepperCircle')
  })
})