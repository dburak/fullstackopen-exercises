describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset');
    const user = {
      name: 'Burak Diker',
      username: 'dburak',
      password: '123456',
    };
    cy.request('POST', 'http://localhost:3003/api/users/', user);
    cy.visit('http://localhost:3000');
  });

  it('Login form is shown', function () {
    cy.contains('Log in to application');
  });
});

describe('Login', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset');
    const user = {
      name: 'Burak Diker',
      username: 'dburak',
      password: '123456',
    };
    const user2 = {
      name: 'Test Name',
      username: 'testname',
      password: '123456',
    };
    cy.request('POST', 'http://localhost:3003/api/users/', user);
    cy.request('POST', 'http://localhost:3003/api/users/', user2);
    cy.visit('http://localhost:3000');
  });
  it('succeeds with correct credentials', function () {
    const user = {
      username: 'dburak',
      password: '123456',
    };
    cy.request('POST', 'http://localhost:3003/api/login/', user).then(
      (response) => {
        localStorage.setItem('loggedBlogUser', JSON.stringify(response.body));
        cy.visit('http://localhost:3000');
      }
    );
    cy.contains('blogs');
    cy.contains('create new blog');
  });
  it('fails with wrong credentials', function () {
    const user = {
      username: 'dburak',
      password: '123',
    };
    cy.request({
      method: 'POST',
      url: 'http://localhost:3003/api/login',
      body: user,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(401);
    });
  });
  it('A blog can be created', function () {
    const user = {
      username: 'dburak',
      password: '123456',
    };
    cy.request('POST', 'http://localhost:3003/api/login/', user).then(
      (response) => {
        localStorage.setItem('loggedBlogUser', JSON.stringify(response.body));
        cy.visit('http://localhost:3000');
      }
    );
    cy.contains('create new blog').click();
    cy.get('#title').type('Test Title');
    cy.get('#author').type('Test Author');
    cy.get('#url').type('Test Url');
    cy.get('#btnSubmit').contains('create').click();
    cy.get('.blog').contains('Test Title').should('exist');
  });
  it('Confirms users can like a blog', function () {
    const user = {
      username: 'dburak',
      password: '123456',
    };
    cy.request('POST', 'http://localhost:3003/api/login/', user).then(
      (response) => {
        localStorage.setItem('loggedBlogUser', JSON.stringify(response.body));
        cy.visit('http://localhost:3000');
      }
    );
    cy.contains('create new blog').click();
    cy.get('#title').type('Test Title');
    cy.get('#author').type('Test Author');
    cy.get('#url').type('Test Url');
    cy.get('#btnSubmit').contains('create').click();
    cy.get('#btnView').contains('view').click();
    cy.get('#btnLike').contains('like').click();
  });
  it('User who created a blog can delete it', function () {
    const user = {
      username: 'dburak',
      password: '123456',
    };
    cy.request('POST', 'http://localhost:3003/api/login/', user).then(
      (response) => {
        localStorage.setItem('loggedBlogUser', JSON.stringify(response.body));
        cy.visit('http://localhost:3000');
      }
    );
    cy.contains('create new blog').click();
    cy.get('#title').type('Test Title');
    cy.get('#author').type('Test Author');
    cy.get('#url').type('Test Url');
    cy.get('#btnSubmit').contains('create').click();
    cy.get('#btnView').contains('view').click();
    cy.get('#btnRemove').contains('remove').click();
  });
  it('Only the creator can see the delete button of a blog, not anyone else', function () {
    const user = {
      username: 'dburak',
      password: '123456',
    };
    cy.request('POST', 'http://localhost:3003/api/login/', user).then(
      (response) => {
        localStorage.setItem('loggedBlogUser', JSON.stringify(response.body));
        cy.visit('http://localhost:3000');
      }
    );
    cy.contains('create new blog').click();
    cy.get('#title').type('Test Title');
    cy.get('#author').type('Test Author');
    cy.get('#url').type('Test Url');
    cy.get('#btnSubmit').contains('create').click();
    cy.get('#btnLogout').contains('logout').click();

    const user2 = {
      username: 'testname',
      password: '123456',
    };
    cy.request('POST', 'http://localhost:3003/api/login/', user2).then(
      (response) => {
        localStorage.setItem('loggedBlogUser', JSON.stringify(response.body));
        cy.visit('http://localhost:3000');
      }
    );
    cy.get('#btnView').contains('view').click();
    cy.get('#btnRemove').should('not.exist');
  });
  it.only('Checks that the blogs are ordered according to likes with the blog with the most likes being first', function () {
    const user = {
      username: 'dburak',
      password: '123456',
    };
    cy.request('POST', 'http://localhost:3003/api/login/', user).then(
      (response) => {
        localStorage.setItem('loggedBlogUser', JSON.stringify(response.body));
        cy.visit('http://localhost:3000');
      }
    );
    cy.contains('create new blog').click();
    cy.get('#title').type('Test Title with second most likes');
    cy.get('#author').type('Test Author');
    cy.get('#url').type('Test Url');
    cy.get('#btnSubmit').contains('create').click();
    cy.get('#btnView').contains('view').click();
    cy.get('.blog').eq(0).get('#btnLike').contains('like').click();
    cy.wait(300)
    cy.get('.blog').eq(0).get('#btnLike').contains('like').click();
    cy.get('.blog').eq(0).get('#btnHide').contains('hide').click();

    cy.contains('create new blog').click();
    cy.get('#title').type('Test Title with most likes');
    cy.get('#author').type('Test Author');
    cy.get('#url').type('Test Url');
    cy.get('#btnSubmit').contains('create').click();
    cy.get('.blog').eq(1).contains('view').click();
    cy.get('.blog').eq(1).get('#btnLike').contains('like').click();
    cy.wait(300)
    cy.get('.blog').eq(1).get('#btnLike').contains('like').click();
    cy.wait(300)
    cy.get('.blog').eq(1).get('#btnLike').contains('like').click();
    cy.get('.blog').eq(1).get('#btnHide').contains('hide').click();
    cy.visit('http://localhost:3000')

    cy.get('.blog').eq(0).should('contain', 'Test Title with most likes')
    cy.get('.blog').eq(1).should('contain', 'Test Title with second most likes')

  });
});
