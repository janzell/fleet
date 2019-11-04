import {gql} from 'apollo-boost';

const dropUnitsFields = `id
    plate_number
    body_number
    engine_number
    case_number
    acquired_at
    year_model
    status
    sticker
    acquired_at
    or_number
    or_issued_at
    cr_number
    cr_issued_at
    notes
    series_id
    series {
        id
        name
    }
    mv_file_number
    private_number
    temporary_plate_number
    created_at
    updated_at
`;

const GET_DROP_UNITS_LIST = gql`
    query getDropUnitsList($limit: Int!, $offset: Int!, $order_by: [drop_units_order_by!], $where: drop_units_bool_exp) {
        drop_units(limit: $limit, offset: $offset, order_by: $order_by, where: $where) {
            ${dropUnitsFields}
        }
    }`;

const ADD_DROP_UNIT = gql`
    mutation addTaxi($dropUnits: [drop_units_insert_input!]!) {
        insert_drop_units(objects: $dropUnits) {
            affected_rows
            returning {
                ${dropUnitsFields}
            }
        }
    }`;

const DELETE_DROP_UNIT = gql`
    mutation deleteTaxi($id: Int!) {
        delete_drop_units(where: {id: {_eq: $id}}) {
            affected_rows
        }
    }`;

const UPDATE_DROP_UNIT = gql`
    mutation updateTaxi($id: Int!, $dropUnits: drop_units_set_input) {
        update_drop_units(where: {id: {_eq: $id}}, _set: $dropUnits) {
            affected_rows
            returning {
                ${dropUnitsFields}
            }
        }
    }`;

const GET_TOTAL_COUNT = gql`
    {
        drop_units_aggregate {
            aggregate {
                count
            }
        }
    }
`;

export {GET_DROP_UNITS_LIST, GET_TOTAL_COUNT, DELETE_DROP_UNIT, UPDATE_DROP_UNIT, ADD_DROP_UNIT};
