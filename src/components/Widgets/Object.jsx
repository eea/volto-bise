import React from 'react';
import { Field } from '@plone/volto/components';

// TODO: handle more then the default schema?

const Object = ({ schema, value, onChange, errors = {} }) => {
  return (
    <>
      {schema.fieldsets[0].fields.map((field, index) => {
        return (
          <Field
            {...schema.properties[field]}
            id={field}
            fieldSet={schema.fieldsets[0].title.toLowerCase()}
            focus={index === 0}
            value={value[field]}
            required={schema.required.indexOf(field) !== -1}
            onChange={(id, value) => onChange(field, value)}
            key={field}
            error={errors[field]}
          />
        );
      })}
    </>
  );
};

export default Object;
