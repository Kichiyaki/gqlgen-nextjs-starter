import gql from "graphql-tag";

export const SIGNUP_MUTATION = gql`
  mutation signupMutation($user: UserInput!) {
    signup(user: $user) {
      id
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation loginMutation($login: String!, $password: String!) {
    login(login: $login, password: $password) {
      id
    }
  }
`;
