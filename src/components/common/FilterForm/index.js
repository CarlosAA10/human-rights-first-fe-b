import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Select,
  Input,
  Checkbox,
  Button,
  Typography,
  DatePicker,
  Row,
  Col,
} from 'antd';
import { updateFilters } from '../../../state/actions';
import 'antd/dist/antd.css';
import './FilterForm.css';
import statesDB from '../../../database/states.json';
import { initialIncidents } from '../../../state/reducers/filtersReducer';
import { incidents, sources } from './assets';

const { Title } = Typography;
const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;

export default function FiltersForm() {
  const dispatch = useDispatch();
  const [incidentsState, stateName, zipCode] = useSelector(store => [
    store.filters.incidents,
    store.filters.stateName,
    store.filters.zipCode,
  ]);
  console.log(incidentsState);
  // filter out Alaska and Hawaii -- Maybe include them in a cutout?
  const filteredStates = statesDB.filter(state => {
    return state.state !== 'Alaska' && state.state !== 'Hawaii';
  });

  // This changes the incident name to match the keys of the initialIncidents object
  const getKeyFromName = name => {
    let key = [...name].filter(char => char !== ' ');
    key[0] = key[0].toLowerCase();
    key = key.join('');

    return key;
  };
  return (
    <div className="filter-box">
      <div className="search-bars">
        {/* Waiting on data from backend to implement rangePicker
        onChange needs to filter incidents where date >= selectedDate1 and date <= selectedDate2 
        */}
        <RangePicker allowClear />

        <Select
          allowClear
          showSearch // useful to not have to scroll through 50+ items to find what you're looking for
          onSelect={stateName => dispatch(updateFilters({ stateName }))}
          placeholder="Select a State"
          style={{ width: 150 }}
          value={stateName}
        >
          {filteredStates.map(state => {
            return <Option value={state.state}>{state.state}</Option>;
          })}
        </Select>
        <Search
          placeholder="Zip Code"
          allowClear
          // onSearch={(value, e) => dispatch(updateFilters({ zipCode: value }))}
          style={{ width: 150 }}
          // onChange={e => dispatch(updateFilters({ zipCode: e.target.value }))}
          // value={zipCode}
        />
        <Button
          type="link"
          onClick={() => {
            dispatch(updateFilters({ incidents: initialIncidents }));
            dispatch(updateFilters({ stateName: null, zipCode: null }));
          }}
        >
          Reset Filters
        </Button>
      </div>
      <div className="filter-types">
        <div className="incident-filters">
          <Title level={5}>Incident Type</Title>
          <div className="checkboxes">
            <Row>
              {incidents.map((incident, id) => {
                return (
                  <Col span={6}>
                    <Checkbox
                      checked={incidentsState[getKeyFromName(incident)]} // Control the "checked" attribute with the boolean value of the state.
                      onChange={e => {
                        let incidentKey = getKeyFromName(incident);
                        dispatch(
                          updateFilters({
                            incidents: {
                              ...incidentsState,
                              [incidentKey]: e.target.checked,
                            },
                          })
                        );
                      }}
                    >
                      {incident}
                    </Checkbox>
                  </Col>
                );
              })}
            </Row>
          </div>
        </div>

        {/* Sources are not yet implemented */}

        <div className="source-filters">
          <Title level={5}>Source Type</Title>
          <div className="checkboxes">
            <Checkbox.Group style={{ width: '100%' }} defaultValue={sources}>
              <Row>
                {sources.map((source, id) => {
                  return (
                    <Col span={12}>
                      <Checkbox
                        value={source}
                        onChange={() => console.log({ source })}
                      >
                        {source}
                      </Checkbox>
                    </Col>
                  );
                })}
              </Row>
            </Checkbox.Group>
          </div>
        </div>
      </div>
    </div>
  );
}