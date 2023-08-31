/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPost = /* GraphQL */ `
  query GetPost($id: ID!) {
    getPost(id: $id) {
      id
      type
      username
      content
      email
      createdAt
      comments {
        items {
          id
          content
          createdAt
          owner
          updatedAt
          postCommentsId
          __typename
        }
        nextToken
        __typename
      }
      owner
      updatedAt
      __typename
    }
  }
`;
export const listPosts = /* GraphQL */ `
  query ListPosts(
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPosts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        type
        username
        content
        email
        createdAt
        comments {
          nextToken
          __typename
        }
        owner
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const PostsByCreatedat = /* GraphQL */ `
  query PostsByCreatedat(
    $type: String!
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    PostsByCreatedat(
      type: $type
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        type
        username
        content
        email
        createdAt
        comments {
          nextToken
          __typename
          items {
            content
            createdAt
            owner
            updatedAt
            postCommentsId
          }
        }
        owner
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getComment = /* GraphQL */ `
  query GetComment($id: ID!) {
    getComment(id: $id) {
      id
      post {
        id
        type
        username
        content
        email
        createdAt
        comments {
          nextToken
          __typename
        }
        owner
        updatedAt
        __typename
      }
      content
      createdAt
      owner
      updatedAt
      postCommentsId
      __typename
    }
  }
`;
export const listComments = /* GraphQL */ `
  query ListComments(
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listComments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        post {
          id
          type
          username
          content
          email
          createdAt
          owner
          updatedAt
          __typename
        }
        content
        createdAt
        owner
        updatedAt
        postCommentsId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
