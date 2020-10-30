import React from 'react';
import cx from 'classnames';
import { connectBlockToProviderData } from 'volto-datablocks/hocs';
import { Grid } from 'semantic-ui-react';
import loadable from '@loadable/component';
import { serializeNodes } from 'volto-slate/editor/render';
import {
  customSelectStyles,
  DropdownIndicator,
  Option,
  selectTheme,
} from '@plone/volto/components/manage/Widgets/SelectStyling';
import { makeChartTiles } from './utils';
import './style.css';

const Select = loadable(() => import('react-select'));
const LoadablePlot = loadable(() => import('react-plotly.js'));

const SelectCountry = (props) => {
  const { id, onChange, data } = props;
  const countries = Array.from(new Set(data['Country_name']));
  const options = countries.map((c) => ({ label: c, value: c }));
  return (
    <Select
      id={`field-${id}`}
      name={id}
      className="react-select-container"
      classNamePrefix="react-select"
      isMulti={id === 'roles' || id === 'groups'}
      options={options}
      styles={customSelectStyles}
      theme={selectTheme}
      components={{ DropdownIndicator, Option }}
      defaultValue={null}
      onChange={onChange}
    />
  );
};

const View = ({ data, provider_data, id, ...rest }) => {
  const focusEcosystem = data.ecosystem;
  const [focusOn, setFocusOn] = React.useState();
  const [multiCharts, setMultiCharts] = React.useState([]);
  React.useEffect(() => {
    if (provider_data) {
      const { hoverTemplate } = data;
      setMultiCharts(
        makeChartTiles(provider_data, focusOn, focusEcosystem, {
          hoverTemplate,
        }),
      );
    }
  }, [provider_data, focusOn, focusEcosystem, data]);

  return (
    <div className={cx('block align', data.align)}>
      <div
        className={cx({
          'full-width': data.align === 'full',
        })}
      >
        <h3>{data.title}</h3>
        {/* <div className="block-wrapper">{JSON.stringify(data)}</div> */}

        <div class="maes-viewer-grid">
          <div class="maes-viewer-select">
            {provider_data && (
              <SelectCountry
                data={provider_data}
                id={`${id}-select-country`}
                onChange={(data) => {
                  setFocusOn(data.value);
                }}
                defaultValue={
                  focusOn ? { value: focusOn, label: focusOn } : null
                }
              />
            )}
            <div>{serializeNodes(data.description)}</div>
          </div>
          <div class="maes-viewer-charts">
            {provider_data
              ? multiCharts.map((chart, index) => {
                  return (
                    <>
                      <div>{chart.title}</div>
                      <LoadablePlot
                        key={index}
                        data={chart.data}
                        layout={chart.layout}
                        frames={[]}
                        config={{
                          displayModeBar: false,
                          editable: false,
                          responsive: false,
                          // useResizeHandler: true,
                        }}
                      />
                    </>
                  );
                })
              : ''}
          </div>
        </div>
      </div>
    </div>
  );
};

export default connectBlockToProviderData(View);
