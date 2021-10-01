describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Kate',
      username: 'kt899',
      password: 'fluid444'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('kt899')
      cy.get('#password').type('fluid444')
      cy.get('#login-button').click()

      cy.contains('Kate logged-in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('kt899')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.error').should('contain', 'wrong username or password')
      cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')

      cy.get('html').should('not.contain', 'Kate logged-in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'kt899', password: 'fluid444' })
    })

    it('A blog can be created', function() {
      cy.contains('create new blog').click()
      cy.get('#title').type('new title')
      cy.get('#author').type('new author')
      cy.get('#url').type('newurl.com')
      cy.get('#create-button').click()
      cy.get('.notification').contains('a new blog new title by new author added')
      cy.contains('new title new author')
    })

    describe('and a blog exists', function() {
      beforeEach(function() {
        cy.createBlog({
          title: 'new title',
          author: 'new author',
          url: 'newurl.com'
        })
        cy.get('#view-button').click()
      })

      it('can be liked', function() {
        cy.contains('likes 0')
          .get('#like-button')
          .click()
        cy.contains('likes 1')
      })

      it('can be deleted', function() {
        cy.get('#delete-button').click()
        cy.get('.notification').contains('new title by new author deleted')

        cy.get('html').should('not.contain', 'new title new author')
      })
    })
  })
})
