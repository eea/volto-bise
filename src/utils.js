import config from '@plone/volto/registry';
import { flattenToAppURL } from '@plone/volto/helpers';

export const getPath = (url) =>
  url.startsWith('http') ? new URL(url).pathname : url;

export const fixUrl = (url) =>
  (url || '').includes(config.settings.apiPath)
    ? `${flattenToAppURL(url.replace('/api', ''))}/@@images/image`
    : `${url.replace('/api', '')}/@@images/image`;
