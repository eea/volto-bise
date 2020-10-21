import cx from 'classnames';
import { Link } from 'react-router-dom';
import { settings } from '~/config';
import { flattenToAppURL } from '@plone/volto/helpers';
import React, { useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import { clone } from 'lodash';

export const thumbUrl = (url) => {
  return url.replace(/\@\@images(.*)$/, '@@images/image/large');
}

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
            <img src={thumbUrl(attachedimage)} alt={title} />
            <h5>{title}</h5>
          </Link>
        </>
      ) : (
          <>
            <img src={thumbUrl(attachedimage)} alt={title} />
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
              {(cards || []).map((card) => (
                <Grid.Column mobile={12} tablet={6} computer={3}>
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
