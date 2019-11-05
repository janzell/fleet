import {gql} from 'apollo-boost';

const caseNumberFields = `
    number
    expired_at
    notes
    created_at
    updated_at
    `;

const ALL_CASE_NUMBERS = gql`
    query getAllCaseNumbers {
        case_numbers {
            ${caseNumberFields}
        }
    }
`;

const GET_CASE_NUMBER_LIST = gql`
    query getCaseNumberList($limit: Int!, $offset: Int!, $order_by: [case_numbers_order_by!], $where: case_numbers_bool_exp) {
        case_numbers(limit: $limit,offset: $offset, order_by: $order_by, where: $where) {
            ${caseNumberFields}
        }
    }`;

const CASE_NUMBER_SUBSCRIPTION = gql`
    subscription onCaseNumberAdded($limit: Int, $offset: Int, $order_by: [case_numbers_order_by!]) {
        case_numbers(limit: $limit, offset: $offset, order_by: $order_by){
            ${caseNumberFields}
        }
    }
`;

const ADD_CASE_NUMBER = gql`
    mutation addCaseNumber($case_numbers: [case_numbers_insert_input!]!) {
        insert_case_numbers(objects: $case_numbers) {
            affected_rows
            returning {
                ${caseNumberFields}
            }
        }
    }`;

const DELETE_CASE_NUMBER = gql`
    mutation deleteCaseNumber($number: String!) {
        delete_case_numbers(where: {number: {_eq: $number}}) {
            affected_rows
        }
    }`;

const UPDATE_CASE_NUMBER = gql`
    mutation updateCaseNumber($number: String!, $case_numbers: case_numbers_set_input) {
        update_case_numbers(where: {number: {_eq: $number}}, _set: $case_numbers) {
            affected_rows
            returning {
                ${caseNumberFields}
            }
        }
    }`;

const GET_TOTAL_COUNT = gql`
    query getTotalCount($where:case_numbers_bool_exp) {
        case_numbers_aggregate(where: $where){
            aggregate {
                count
            }
        }
    }`;

export {
  GET_CASE_NUMBER_LIST,
  GET_TOTAL_COUNT,
  DELETE_CASE_NUMBER,
  UPDATE_CASE_NUMBER,
  ADD_CASE_NUMBER,
  CASE_NUMBER_SUBSCRIPTION,
  ALL_CASE_NUMBERS
};
