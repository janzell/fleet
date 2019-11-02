import {gql} from 'apollo-boost';

const garageFields = `id
    name
    address
    created_at
    updated_at
    `;

const ALL_GARAGE = gql`
    query getAllGarages {
        garages {
            ${garageFields}
        }
    }
`;

const GET_GARAGE_LIST = gql`
    query getGarageList($limit: Int!, $offset: Int!, $order_by: [garages_order_by!], $where: garages_bool_exp) {
        garages(limit: $limit,offset: $offset, order_by: $order_by, where: $where) {
            ${garageFields}
        }
    }`;

const GARAGE_SUBSCRIPTION = gql`
    subscription onGarageAdded($limit: Int, $offset: Int, $order_by: [garages_order_by!]) {
        garages(limit: $limit, offset: $offset, order_by: $order_by){
            ${garageFields}
        }
    }
`;

const ADD_GARAGE = gql`
    mutation addGarage($garages: [garages_insert_input!]!) {
        insert_garages(objects: $garages) {
            affected_rows
            returning {
                ${garageFields}
            }
        }
    }`;

const DELETE_GARAGE = gql`
    mutation deleteGarage($id: Int!) {
        delete_garages(where: {id: {_eq: $id}}) {
            affected_rows
        }
    }`;

const UPDATE_GARAGE = gql`
    mutation updateGarage($number: String!, $garages: garages_set_input) {
        update_garages(where: {id: {_eq: $id}}, _set: $garages) {
            affected_rows
            returning {
                ${garageFields}
            }
        }
    }`;

const GET_TOTAL_COUNT = gql`
    {
        garages_aggregate {
            aggregate {
                count
            }
        }
    }
`;

export {GET_GARAGE_LIST, GET_TOTAL_COUNT, DELETE_GARAGE, UPDATE_GARAGE, ADD_GARAGE, GARAGE_SUBSCRIPTION, ALL_GARAGE};
