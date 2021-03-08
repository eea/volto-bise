import { readAsDataURL } from 'promise-file-reader';
import { connect } from 'react-redux';
import { Dimmer, Loader, Item, Message, Label } from 'semantic-ui-react';
import Dropzone from 'react-dropzone';
import React, { Component } from 'react';
import { flattenToAppURL, getBaseUrl } from '@plone/volto/helpers';

import imageBlockSVG from '@plone/volto/components/manage/Blocks/Image/block-image.svg';
import { createContent } from '@plone/volto/actions';
import { FormFieldWrapper } from '@plone/volto/components';
import { v4 as uuid } from 'uuid';

import config from '@plone/volto/registry';

export const oldThumbUrl = (url) =>
  (url || '').includes(config.settings.apiPath)
    ? `${flattenToAppURL(url)}/@@images/image/thumb`
    : url;

export const thumbUrl = (url, preview_size) => {
  return `${url}/@@images/image/${preview_size}`;
};

export class UnconnectedAttachedImageWidget extends Component {
  // Can show a preview of uploaded image.
  // If there's no uploaded image, shows a drag&drop area

  constructor(props) {
    super(props);
    this.state = {
      uploading: false,
      uid: uuid(),
      errorMessage: null,
    };

    this.onDrop = this.onDrop.bind(this);
  }

  componentDidMount() {
    if (this.props.focus) {
      this.node.focus();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.requests?.[this.state.uid]?.loading &&
      this.props.requests?.[this.state.uid]?.loaded &&
      this.state.uploading
    ) {
      this.setState({
        uploading: false,
        errorMessage: null,
      });

      const url = this.props.requests[this.state.uid].data['@id'];
      this.props.onChange(this.props.id, flattenToAppURL(url));
    }
  }

  onDrop(acceptedFiles) {
    this.setState((state) => {
      return { ...state, uploading: true, errorMessage: null };
    });

    const promises = [];

    acceptedFiles.forEach((file) => {
      const p = readAsDataURL(file).then((data) => {
        const fields = data.match(/^data:(.*);(.*),(.*)$/);

        if (fields.length !== 4) {
          throw new Error('Invalid image data');
        }

        const payload = {
          '@type': 'Image',
          title: file.name,
          image: {
            data: fields[3],
            encoding: fields[2],
            'content-type': fields[1],
            filename: file.name,
          },
        };
        return this.props.createContent(
          getBaseUrl(this.props.pathname),
          payload,
          this.state.uid,
        );
      });
      promises.push(p);
    });

    return Promise.all(promises).then(
      () => {
        this.setState(
          (state) => {
            return { ...state, uploading: false, errorMessage: null };
          },
          () => {
            if (typeof this.props.onChange === 'function') {
              this.props.onChange(
                this.props.id,
                this.props.requests[this.state.uid].data?.['@id'] || '',
              );
            }
          },
        );
      },
      (err) => {
        this.setState((state) => {
          return { ...state, uploading: false, errorMessage: err.message };
        });
      },
    );
  }

  render() {
    const { value, preview_size = 'thumb' } = this.props;

    return (
      <FormFieldWrapper {...this.props}>
        <div>
          <Dropzone onDrop={this.onDrop} className="dropzone">
            {({ getRootProps, getInputProps }) => {
              return (
                <Message {...getRootProps()}>
                  {this.state.uploading && (
                    <Dimmer active>
                      <Loader indeterminate>Uploading</Loader>
                    </Dimmer>
                  )}
                  <center>
                    <Item>
                      <input {...getInputProps()} />
                      {value ? (
                        <Item.Image
                          src={flattenToAppURL(thumbUrl(value, preview_size))}
                        />
                      ) : (
                        <>
                          <img src={imageBlockSVG} alt="" />
                          <div className="discreet">
                            Click or drag file here
                          </div>
                        </>
                      )}
                    </Item>
                  </center>
                </Message>
              );
            }}
          </Dropzone>
          {this.state.errorMessage && this.state.errorMessage && (
            <Label basic color="red" pointing>
              {this.state.errorMessage}
            </Label>
          )}
        </div>
      </FormFieldWrapper>
    );
  }
}

export default connect(
  (state, props) => ({
    pathname: state.router.location.pathname,
    requests: state.content.subrequests,
  }),
  {
    createContent,
  },
)(UnconnectedAttachedImageWidget);
