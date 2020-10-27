import React from 'react';
import { flattenToAppURL } from '@plone/volto/helpers';

const HeaderImage = ({ ...props }) => {
  return (
    <div>
      {props.url && (
        <div className="leadimage-header">
          <div className="leadimage-container">
            <div className="leadimage-wrapper">
              <div
                className="leadimage document-image"
                style={{
                  backgroundImage: `url(${flattenToAppURL(props.url)})`,
                }}
              />
              <div className="image-layer" />
              <div className="ui container image-content">
                <h1 className="leadimage-title">{props.title}</h1>
                <p>{props.description}</p>
              </div>
              <div className="ui container">
                <p className="leadimage-caption">{props.image_caption}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default HeaderImage;
