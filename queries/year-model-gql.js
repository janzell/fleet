import {gql} from 'apollo-boost';

const yearModelFields = `
    name
    notes
    created_at
    updated_at
    `;


const ALL_YEAR_MODELS = gql`
    query getAllYearModels {
        year_models {
            ${yearModelFields}
        }
    }
`;


const GET_YEAR_MODEL_LIST = gql`
    query getYearModelList($limit: Int!, $offset: Int!, $order_by: [year_models_order_by!], $where: year_models_bool_exp) {
        year_models(limit: $limit,offset: $offset, order_by: $order_by, where: $where) {
            ${yearModelFields}
        }
    }`;

const YEAR_MODEL_SUBSCRIPTION = gql`
    subscription onYearModelAdded($limit: Int, $offset: Int, $order_by: [year_models_order_by!]) {
        year_models(limit: $limit, offset: $offset, order_by: $order_by){
            ${yearModelFields}
        }
    }
`;

const ADD_YEAR_MODEL = gql`
    mutation addYearModel($year_models: [year_models_insert_input!]!) {
        insert_year_models(objects: $year_models) {
            affected_rows
            returning {
                ${yearModelFields}
            }
        }
    }`;

const DELETE_YEAR_MODEL = gql`
    mutation deleteYearModel($name: String!) {
        delete_year_models(where: {name: {_eq: $name}}) {
            affected_rows
        }
    }`;

const UPDATE_YEAR_MODEL = gql`
    mutation updateYearModel($name: String!, $year_models: year_models_set_input) {
        update_year_models(where: {name: {_eq: $name}}, _set: $year_models) {
            affected_rows
            returning {
                ${yearModelFields}
            }
        }
    }`;

const GET_TOTAL_COUNT = gql`
    query getTotalCount($where:year_models_bool_exp) {
        year_models_aggregate(where: $where){
            aggregate {
                count
            }
        }
    }
`;

export {
  GET_YEAR_MODEL_LIST,
  GET_TOTAL_COUNT,
  DELETE_YEAR_MODEL,
  UPDATE_YEAR_MODEL,
  ADD_YEAR_MODEL,
  YEAR_MODEL_SUBSCRIPTION,
  ALL_YEAR_MODELS
};
