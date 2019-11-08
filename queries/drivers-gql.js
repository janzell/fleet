import {gql} from 'apollo-boost';

const driverFields = `id
    driver_number
    first_name
    last_name
    middle_name
    license_number
    city_address
    telephone_number
    provincial_address
    email_address
    birthdate
    birthplace
    height
    weight
    religion
    civil_status
    citizenship
    gender
    spouse_name
    spouse_address
    occupation
    father_name
    father_occupation
    mother_name
    mother_occupation
    parent_address
    parent_tel_number
    language
    character_references {
        name
        position
        telephone_number
    }
    educational_attainments {
        primary_degree
        primary_school_name
        primary_year_attended
        secondary_degree
        secondary_school_name
        secondary_year_attended
        tertiary_degree
        tertiary_school_name
        tertiary_year_attended
        vocational_degree
        vocational_school_name
        vocational_year_attended
        special_skills
        others
    }
    employment_histories {
        company_name
        position
        start_date
        end_date
    }
    other_infos { 
        employment_status
    }
    created_at
    updated_at
    `;

const GET_DRIVERS_LIST = gql`
    query getDriversList($limit: Int!, $offset: Int!, $order_by: [drivers_order_by!], $where: drivers_bool_exp) {
        drivers(limit: $limit,offset: $offset, order_by: $order_by, where: $where) {
            ${driverFields}
        }
    }`;

const DRIVERS_SUBSCRIPTION = gql`
    subscription onDriversAdded($limit: Int, $offset: Int, $order_by: [drivers_order_by!]) {
        drivers(limit: $limit, offset: $offset, order_by: $order_by){
            ${driverFields}
        }
    }
`;

const ADD_DRIVER = gql`
    mutation addDriver($driver: [drivers_insert_input!]!) {
        insert_drivers(objects: $driver) {
            affected_rows
            returning {
                ${driverFields}
            }
        }
    }`;

const DELETE_DRIVER = gql`
    mutation deleteDriver($id: Int!) {
        delete_drivers(where: {id: {_eq: $id}}) {
            affected_rows
        }
    }`;

const UPDATE_DRIVER = gql`
    mutation updateDriver($id: Int!, $driver: drivers_set_input) {
        update_drivers(where: {id: {_eq: $id}}, _set: $driver) {
            affected_rows
            returning {
                ${driverFields}
            }
        }
    }`;

const GET_TOTAL_COUNT = gql`
    query getTotalCount($where:drivers_bool_exp) {
        drivers_aggregate(where: $where){
            aggregate {
                count
            }
        }
    }
`;

export {GET_DRIVERS_LIST, GET_TOTAL_COUNT, DELETE_DRIVER, UPDATE_DRIVER, ADD_DRIVER, DRIVERS_SUBSCRIPTION};
