import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { settings } from '~/config';
import { flattenToAppURL } from '@plone/volto/helpers';
import { Grid } from 'semantic-ui-react';
import cx from 'classnames';

export const getPath = (url) =>
  url.startsWith('http') ? new URL(url).pathname : url;

// TODO: the approach for the URL path generation is not correct, it does not
// work on local;

export const thumbUrl = (url) =>
  (url || '').includes(settings.apiPath)
    ? `${flattenToAppURL(url.replace('/api', ''))}/@@images/image/preview`
    : `${url.replace('/api', '')}/@@images/image/preview`;

export const Card = (props) => {
  const { title, link, attachedimage } = props; // text,

  useEffect(() => {
    require('./css/roundtiled.less');
  });

  return (
    <div className="card">
      {link ? (
        <>
          <Link to={link}>
            <div
              className="card-image"
              style={{
                backgroundImage: `url(${thumbUrl(getPath(attachedimage))})`,
              }}
            >
            </div>
            <h5>{title}</h5>
          </Link>
        </>
      ) : (
        <>
          <div
            className="card-image"
            style={{
              backgroundImage: `url(${thumbUrl(getPath(attachedimage))})`,
            }}
          >
          </div>
          <h5>{title}</h5>
        </>
      )}
    </div>
  );
};

const RoundTiled = ({ data }) => {
  const { title, cards } = data;
  return (
    <div
      className={cx(
        'block align imagecards-block',
        {
          center: !Boolean(data.align),
        },
        data.align,
      )}
    >
      <div
        className={cx({
          'full-width': data.align === 'full',
        })}
      >
        <div className="roundtiled">
          <h2>{title}</h2>
          <div className="cards">
            <Grid>
              {(cards || []).map((card, i) => (
                <Grid.Column key={i} mobile={12} tablet={6} computer={3}>
                  <Card {...card} />
                </Grid.Column>
              ))}
            </Grid>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoundTiled;
