import { gql } from 'apollo-boost';

const userFields = `id
    first_name
    last_name`;

const GET_USER_LIST = gql`
  query getUsersList($limit: Int!, $offset: Int!) {
   user(limit: $limit, order_by: {created_at: asc}, offset: $offset) {
    ${userFields}
  }
}`;

export {GET_USER_LIST};
