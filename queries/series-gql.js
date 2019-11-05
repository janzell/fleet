import {gql} from 'apollo-boost';

const seriesFields = `id
    name
    notes
    created_at
    updated_at
    `;

const ALL_SERIES = gql`
    query getAllSeries {
        series {
            ${seriesFields}
        }
    }
`;

const GET_SERIES_LIST = gql`
    query getSeriesList($limit: Int!, $offset: Int!, $order_by: [series_order_by!], $where: series_bool_exp) {
        series(limit: $limit,offset: $offset, order_by: $order_by, where: $where) {
            ${seriesFields}
        }
    }`;

const SERIES_SUBSCRIPTION = gql`
    subscription onSeriesAdded($limit: Int, $offset: Int, $order_by: [series_order_by!]) {
        series(limit: $limit, offset: $offset, order_by: $order_by){
            ${seriesFields}
        }
    }
`;

const ADD_SERIES = gql`
    mutation addSeries($series: [series_insert_input!]!) {
        insert_series(objects: $series) {
            affected_rows
            returning {
                ${seriesFields}
            }
        }
    }`;

const DELETE_SERIES = gql`
    mutation deleteSeries($id: Int!) {
        delete_series(where: {id: {_eq: $id}}) {
            affected_rows
        }
    }`;

const UPDATE_SERIES = gql`
    mutation updateSeries($id: Int!, $series: series_set_input) {
        update_series(where: {id: {_eq: $id}}, _set: $series) {
            affected_rows
            returning {
                ${seriesFields}
            }
        }
    }`;

const GET_TOTAL_COUNT = gql`
    query getTotalCount($where:series_bool_exp) {
        series_aggregate(where: $where){
            aggregate {
                count
            }
        }
    }
`;

export {GET_SERIES_LIST, GET_TOTAL_COUNT, DELETE_SERIES, UPDATE_SERIES, ADD_SERIES, SERIES_SUBSCRIPTION, ALL_SERIES};
