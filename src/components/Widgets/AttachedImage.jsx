import { readAsDataURL } from 'promise-file-reader';
import { connect } from 'react-redux';
import {
  Dimmer,
  Form,
  Grid,
  Loader,
  Label,
  Item,
  Icon as IconOld,
  Message,
} from 'semantic-ui-react';
import Dropzone from 'react-dropzone';
import React, { Component } from 'react';
import { Icon as VoltoIcon } from '@plone/volto/components';
import { defineMessages } from 'react-intl';
import { map } from 'lodash';
import { flattenToAppURL, getBaseUrl } from '@plone/volto/helpers';

import imageBlockSVG from '@plone/volto/components/manage/Blocks/Image/block-image.svg';
import { createContent } from '@plone/volto/actions';

import { settings } from '~/config';

const messages = defineMessages({
  default: {
    id: 'Default',
    defaultMessage: 'Default',
  },
  idTitle: {
    id: 'Short Name',
    defaultMessage: 'Short Name',
  },
  idDescription: {
    id: 'Used for programmatic access to the fieldset.',
    defaultMessage: 'Used for programmatic access to the fieldset.',
  },
  title: {
    id: 'Title',
    defaultMessage: 'Title',
  },
  description: {
    id: 'Description',
    defaultMessage: 'Description',
  },
  required: {
    id: 'Required',
    defaultMessage: 'Required',
  },
  delete: {
    id: 'Delete',
    defaultMessage: 'Delete',
  },
});

export const oldThumbUrl = (url) =>
  (url || '').includes(settings.apiPath)
    ? `${flattenToAppURL(url)}/@@images/image/thumb`
    : url;

export const thumbUrl = (content) => {
  return content?.image?.scales?.thumb?.download || '';
};

export class UnconnectedAttachedImageWidget extends Component {
  // Can show a preview of uploaded image.
  // If there's no uploaded image, shows a drag&drop area

  constructor(props) {
    super(props);
    this.state = {
      uploading: false,
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
      prevProps.request.loading &&
      this.props.request.loaded &&
      this.state.uploading
    ) {
      this.setState({
        uploading: false,
      });

      const url = this.props.content['@id'];
      this.props.onChange(this.props.id, flattenToAppURL(url));
    }
  }

  onDrop(acceptedFiles) {
    this.setState((state) => {
      return { ...state, uploading: true };
    });

    const promises = [];

    acceptedFiles.forEach((file) => {
      const p = readAsDataURL(file).then((data) => {
        const fields = data.match(/^data:(.*);(.*),(.*)$/);
        // console.log('fields', fields);

        return this.props.createContent(getBaseUrl(this.props.pathname), {
          '@type': 'Image',
          title: file.name,
          image: {
            data: fields[3],
            encoding: fields[2],
            'content-type': fields[1],
            filename: file.name,
          },
        });
      });
      promises.push(p);
    });

    return Promise.all(promises).then(() => {
      this.setState((state) => {
        return { ...state, uploading: false };
      });
    });
  }

  render() {
    const {
      id,
      title,
      required,
      description,
      error,
      value,
      onEdit,
      onDelete,
      intl,
      icon,
      iconAction,
      fieldSet,
      pathname,
      content,
      request,
    } = this.props;

    const schema = {
      fieldsets: [
        {
          id: 'default',
          title: intl.formatMessage(messages.default),
          fields: ['title', 'id', 'description', 'required'],
        },
      ],
      properties: {
        id: {
          type: 'string',
          title: intl.formatMessage(messages.idTitle),
          description: intl.formatMessage(messages.idDescription),
        },
        title: {
          type: 'string',
          title: intl.formatMessage(messages.title),
        },
        description: {
          type: 'string',
          widget: 'textarea',
          title: intl.formatMessage(messages.description),
        },
        required: {
          type: 'boolean',
          title: intl.formatMessage(messages.required),
        },
      },
      required: ['id', 'title'],
    };

    // console.log('o', { value, tu: oldThumbUrl(value), fu: flattenToAppURL(oldThumbUrl(value) || ''), pathname, content, request });


    // console.log('d', { x: content.image.scales.thumb.download });

    return (
      <Form.Field
        inline
        required={required}
        error={(error || []).length > 0}
        className={description ? 'help text' : 'text'}
        id={`${fieldSet || 'field'}-${id}`}
      >
        <Grid>
          <Grid.Row stretched>
            <Grid.Column width="4">
              <div className="wrapper">
                <label htmlFor={`field-${id}`}>
                  {onEdit && (
                    <i
                      aria-hidden="true"
                      className="grey bars icon drag handle"
                    />
                  )}
                  {title}
                </label>
              </div>
            </Grid.Column>
            <Grid.Column width="8">
              {onEdit && (
                <div className="toolbar">
                  <button
                    className="item ui noborder button"
                    onClick={() => onEdit(id, schema)}
                  >
                    <IconOld name="write square" size="large" color="blue" />
                  </button>
                  <button
                    aria-label={this.props.intl.formatMessage(messages.delete)}
                    className="item ui noborder button"
                    onClick={() => onDelete(id)}
                  >
                    <IconOld name="close" size="large" color="red" />
                  </button>
                </div>
              )}

              {value ? (
                <Item>
                  <Item.Image src={flattenToAppURL(thumbUrl(content))} />
                </Item>
              ) : (
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
                            <img src={imageBlockSVG} alt="" />
                            <input {...getInputProps()} />
                            <div className="discreet">Click or drag file here</div>
                          </center>
                        </Message>
                      );
                    }}
                  </Dropzone>
                </div>
              )}

              {map(error, (message) => (
                <Label key={message} basic color="red" pointing>
                  {message}
                </Label>
              ))}
              {icon && iconAction && (
                <button onClick={iconAction}>
                  <VoltoIcon name={icon} size="18px" />
                </button>
              )}
            </Grid.Column>
          </Grid.Row>
          {description && (
            <Grid.Row stretched>
              <Grid.Column stretched width="12">
                <p className="help">{description}</p>
              </Grid.Column>
            </Grid.Row>
          )}
        </Grid>
      </Form.Field>
    );
  }
}

export default connect(
  (state, props) => ({
    pathname: state.router.location.pathname,
    content: state.content.data,
    request: state.content.create,
  }),
  {
    createContent,
  },
)(UnconnectedAttachedImageWidget);
