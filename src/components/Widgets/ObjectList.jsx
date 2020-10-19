import { map } from 'lodash';
import {
  Button,
  Form,
  Grid,
  Header,
  Icon,
  Input,
  Label,
  Modal,
  Segment,
} from 'semantic-ui-react';
import React, { Fragment, useState } from 'react';
import { Icon as VoltoIcon } from '@plone/volto/components';
import deleteSVG from '@plone/volto/icons/delete.svg';
import penSVG from '@plone/volto/icons/pen.svg';

import ObjectWidget from './Object';

export const FlatObjectList = ({ id, value = [], schema, onChange }) => {
  return (
    <div className="objectlist-widget-content">
      {!value && <ObjectWidget schema={schema} />}
      {value.map((obj, index) => (
        <Fragment key={index}>
          <Grid>
            <Grid.Column width={11}>
              <Segment>
                <ObjectWidget
                  key={index}
                  schema={schema}
                  value={obj}
                  onChange={(fi, fv) =>
                    onChange(
                      id,
                      value.map((v, i) =>
                        i !== index ? v : { ...v, [fi]: fv },
                      ),
                    )
                  }
                />
              </Segment>
            </Grid.Column>
            <Grid.Column width={1}>
              <Button.Group>
                <Button
                  basic
                  circular
                  size="mini"
                  onClick={() =>
                    onChange(id, value.filter((v, i) => i !== index))
                  }
                >
                  <VoltoIcon size="20px" name={deleteSVG} />
                </Button>
              </Button.Group>
            </Grid.Column>
          </Grid>
        </Fragment>
      ))}
    </div>
  );
};

export const ModalObjectListForm = props => {
  const {
    open,
    title,
    className,
    onSave,
    onCancel,
    schema,
    id,
    value = [],
  } = props;

  const empty = {};

  const [stateValue, setStateValue] = useState(value);

  return (
    <Modal open={open} className={className}>
      <Header>{title}</Header>
      <Modal.Content scrolling>
        <FlatObjectList
          {...props}
          value={stateValue}
          onChange={(id, v) => setStateValue(v)}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button
          primary
          basic
          circular
          floated="left"
          icon="add"
          size="big"
          className="icon"
          onClick={() => setStateValue([...stateValue, empty])}
        />

        <Button
          basic
          circular
          primary
          floated="right"
          icon="arrow right"
          aria-label="Save"
          title="Save"
          size="big"
          onClick={() => onSave(id, stateValue)}
        />
        <Button
          basic
          circular
          secondary
          icon="remove"
          aria-label="Cancel"
          title="Cancel"
          floated="right"
          size="big"
          onClick={onCancel}
        />
      </Modal.Actions>
    </Modal>
  );
};

const ObjectListWidget = props => {
  // TODO: notice that the Fragment key={} might cause problems, need to test
  const [open, setOpen] = useState(false);
  const {
    id,
    value = [],
    schema,
    onChange,
    required,
    error,
    fieldSet,
    title,
    description,
    onDelete,
    onEdit,
  } = props;

  return (
    <>
      <ModalObjectListForm
        {...props}
        open={open}
        onSave={(id, value) => {
          setOpen(false);
          onChange(id, value);
        }}
        onCancel={() => setOpen(false)}
      />
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
                    <Icon name="write square" size="large" color="blue" />
                  </button>
                  <button
                    aria-label="Delete"
                    className="item ui noborder button"
                    onClick={() => onDelete(id)}
                  >
                    <Icon name="close" size="large" color="red" />
                  </button>
                </div>
              )}

              <Input
                id={`field-${id}`}
                name={id}
                disabled={true}
                icon={penSVG}
                value={`A collection of ${value.length} items`}
              />
              <button onClick={() => setOpen(true)}>
                <VoltoIcon name={penSVG} size="18px" />
              </button>

              {map(error, message => (
                <Label key={message} basic color="red" pointing>
                  {message}
                </Label>
              ))}
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
    </>
  );
};

export default ObjectListWidget;
