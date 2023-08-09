/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPost = /* GraphQL */ `
  query GetPost($id: ID!) {
    getPost(id: $id) {
      id
      type
      username
      content
      imageUrl
      createdAt
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
        imageUrl
        createdAt
        owner
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const postsByCreatedAt = /* GraphQL */ `
  query PostsByCreatedAt(
    $createdAt: AWSDateTime!
    $sortDirection: ModelSortDirection
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    postsByCreatedAt(
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
        imageUrl
        createdAt
        owner
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
