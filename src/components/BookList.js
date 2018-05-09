import React, { Component } from 'react'
import { gql } from 'apollo-boost'
import { graphql } from 'react-apollo'

class BookList extends Component {
  state = {
    page: 1,
  }
  nextPage = () => {
    this.props.data.fetchMore({
      variables: { page: this.state.page + 1 },
      updateQuery: (prev, { fetchMoreResult }) => {
        this.setState({
          page: this.state.page + 1,
        })
        if (fetchMoreResult.books.length === 0) {
          return Object.assign({}, prev, {
            books: [...prev.books],
          })
        }
        return Object.assign({}, prev, {
          books: [...fetchMoreResult.books],
        })
      },
    })
  }
  render() {
    if (this.props.data.loading) {
      return null
    }
    const renderBooks = this.props.data.books.map(book => {
      return <li key={book._id}>{book.title}</li>
    })
    return (
      <div>
        <ul id="list">{renderBooks}</ul>
        <button onClick={this.nextPage}>Next</button>
      </div>
    )
  }
}

const getBooksQuery = gql`
  query GetBooksQuery($page: Int!) {
    books(page: $page) {
      title
      _id
    }
  }
`

export default graphql(getBooksQuery, {
  options: {
    variables: {
      page: 1,
    },
  },
})(BookList)
