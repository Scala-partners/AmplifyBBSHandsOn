/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreatePost = /* GraphQL */ `
  subscription OnCreatePost(
    $filter: ModelSubscriptionPostFilterInput
    $owner: String
  ) {
    onCreatePost(filter: $filter, owner: $owner) {
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
        }
        nextToken
      }
      owner
      updatedAt
    }
  }
`;
export const onUpdatePost = /* GraphQL */ `
  subscription OnUpdatePost(
    $filter: ModelSubscriptionPostFilterInput
    $owner: String
  ) {
    onUpdatePost(filter: $filter, owner: $owner) {
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
        }
        nextToken
      }
      owner
      updatedAt
    }
  }
`;
export const onDeletePost = /* GraphQL */ `
  subscription OnDeletePost(
    $filter: ModelSubscriptionPostFilterInput
    $owner: String
  ) {
    onDeletePost(filter: $filter, owner: $owner) {
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
        }
        nextToken
      }
      owner
      updatedAt
    }
  }
`;
export const onCreateComment = /* GraphQL */ `
  subscription OnCreateComment(
    $filter: ModelSubscriptionCommentFilterInput
    $owner: String
  ) {
    onCreateComment(filter: $filter, owner: $owner) {
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
        }
        owner
        updatedAt
      }
      content
      createdAt
      owner
      updatedAt
      postCommentsId
    }
  }
`;
export const onUpdateComment = /* GraphQL */ `
  subscription OnUpdateComment(
    $filter: ModelSubscriptionCommentFilterInput
    $owner: String
  ) {
    onUpdateComment(filter: $filter, owner: $owner) {
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
        }
        owner
        updatedAt
      }
      content
      createdAt
      owner
      updatedAt
      postCommentsId
    }
  }
`;
export const onDeleteComment = /* GraphQL */ `
  subscription OnDeleteComment(
    $filter: ModelSubscriptionCommentFilterInput
    $owner: String
  ) {
    onDeleteComment(filter: $filter, owner: $owner) {
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
        }
        owner
        updatedAt
      }
      content
      createdAt
      owner
      updatedAt
      postCommentsId
    }
  }
`;
