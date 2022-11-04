import React from 'react';
import { compose } from 'redux';
import cx from 'classnames';
import loadable from '@loadable/component';

import {
  customSelectStyles,
  DropdownIndicator,
  Option,
  selectTheme,
} from '@plone/volto/components/manage/Widgets/SelectStyling';

import { serializeNodes } from '@plone/volto-slate/editor/render';
import { connectToProviderData } from '@eeacms/volto-datablocks/hocs';
import { makeChartTiles } from './utils';

import './style.css';

const Select = loadable(() => import('react-select'));
const LoadablePlot = loadable(() => import('react-plotly.js'));

const SelectCountry = (props) => {
  const { id, onChange, data } = props;
  const countries = Array.from(new Set(data['Country_name']));
  const options = countries
    .map((c) => ({ label: c, value: c }))
    .concat({ label: 'EU', value: 'EU' });
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
      placeholder="Select country..."
    />
  );
};

const View = ({ data, provider_data, id, ...rest }) => {
  const focusEcosystem = data.ecosystem;
  const [focusOn, setFocusOn] = React.useState();
  const [multiCharts, setMultiCharts] = React.useState([]);
  const [firstRender, setFirstRender] = React.useState(true);
  React.useEffect(() => {
    if (provider_data) {
      const { hoverTemplate } = data;
      const ct = makeChartTiles(provider_data, focusOn, focusEcosystem, {
        hoverTemplate,
      });
      setMultiCharts(ct);

      // TODO: avoid this hack:
      // hack to make the first-in-time selected country's label appear above
      // the blue disc in the View of the MAES Viewer block
      // (to make sure the hack is not needed anymore, remove this piece of code
      // and if in the View of the page with the MAES Viewer's block the View of
      // the MAES Viewer does not show the text above the black disc when first
      // selecting a country in the CountrySelect, the hack is still needed
      // because plotly.js or react-plotly.js puts the label of the black disc
      // asynchronously and I think there is no Promise to depend on it)
      if (firstRender) {
        setTimeout(() => {
          setFirstRender(false);
        }, 2000);
      }
    }
  }, [provider_data, focusOn, focusEcosystem, data, firstRender]);

  return (
    <div className={cx('block align', data.align)}>
      <div
        className={cx({
          'full-width': data.align === 'full',
        })}
      >
        <h3>{data.title}</h3>
        {/* <div className="block-wrapper">{JSON.stringify(data)}</div> */}

        <div className="maes-viewer-grid">
          <div className="maes-viewer-select">
            {provider_data && (
              <>
                <span className="maes-select-label">
                  Compare countries across Europe
                </span>
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
              </>
            )}
            <div>{serializeNodes(data.description)}</div>
          </div>
          <div className="maes-viewer-charts">
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
                          responsive: true,
                        }}
                        useResizeHandler={true}
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

export default compose(connectToProviderData)(View);
