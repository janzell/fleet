import {gql} from 'apollo-boost';

const bodyNumberFields = `
    number
    notes
    created_at
    updated_at
    `;

const ALL_BODY_NUMBERS = gql`
    query getAllBodyNumbers {
        body_numbers {
            ${bodyNumberFields}
        }
    }
`;

const GET_BODY_NUMBER_LIST = gql`
    query getBodyNumberList($limit: Int!, $offset: Int!, $order_by: [body_numbers_order_by!], $where: body_numbers_bool_exp) {
        body_numbers(limit: $limit,offset: $offset, order_by: $order_by, where: $where) {
            ${bodyNumberFields}
        }
    }`;

const BODY_NUMBER_SUBSCRIPTION = gql`
    subscription onBodyNumberAdded($limit: Int, $offset: Int, $order_by: [body_numbers_order_by!]) {
        body_numbers(limit: $limit, offset: $offset, order_by: $order_by){
            ${bodyNumberFields}
        }
    }
`;

const ADD_BODY_NUMBER = gql`
    mutation addBodyNumber($body_numbers: [body_numbers_insert_input!]!) {
        insert_body_numbers(objects: $body_numbers) {
            affected_rows
            returning {
                ${bodyNumberFields}
            }
        }
    }`;

const DELETE_BODY_NUMBER = gql`
    mutation deleteBodyNumber($number: String!) {
        delete_body_numbers(where: {number: {_eq: $number}}) {
            affected_rows
        }
    }`;

const UPDATE_BODY_NUMBER = gql`
    mutation updateBodyNumber($number: String!, $body_numbers: body_numbers_set_input) {
        update_body_numbers(where: {number: {_eq: $number}}, _set: $body_numbers) {
            affected_rows
            returning {
                ${bodyNumberFields}
            }
        }
    }`;

const GET_TOTAL_COUNT = gql`
    query getTotalCount($where:body_numbers_bool_exp) {
        body_numbers_aggregate(where: $where){
            aggregate {
                count
            }
        }
    }
`;

export {
  GET_BODY_NUMBER_LIST,
  GET_TOTAL_COUNT,
  DELETE_BODY_NUMBER,
  UPDATE_BODY_NUMBER,
  ADD_BODY_NUMBER,
  BODY_NUMBER_SUBSCRIPTION,
  ALL_BODY_NUMBERS
};
