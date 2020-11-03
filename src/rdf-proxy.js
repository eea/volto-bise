import superagent from 'superagent';
import cookie from 'react-cookie';
import { parse as parseUrl } from 'url';

import { settings } from '~/config';

export const getAPIResourceWithAuth = (req) =>
  new Promise((resolve) => {
    const internalApiUrl = parseUrl(
      settings.internalApiPath || settings.apiPath,
    );
    const apiUrl = parseUrl(settings.apiPath);

    const scheme = apiUrl.protocol.slice(0, apiUrl.protocol.length - 1);

    const path = `/VirtualHostBase/${scheme}/${apiUrl.hostname}:${apiUrl.port}${apiUrl.path}/VirtualHostRoot${req.path}`;
    const url = `${internalApiUrl.hostname}:${internalApiUrl.port}${path}`;
    const request = superagent.get(url).responseType('blob');
    const authToken = cookie.load('auth_token');
    if (authToken) {
      request.set('Authorization', `Bearer ${authToken}`);
    }
    request.end((error, res = {}) => {
      if (error) {
        resolve(res || error);
      } else {
        resolve(res);
      }
    });
  });

export default (config) => {
  if (__SERVER__) {
    const express = require('express');
    const middleware = express.Router();

    middleware.all('/**/@@rdf', function (req, res, next) {
      getAPIResourceWithAuth(req).then((resource) => {
        res.send(resource.body);
      });
    });
    middleware.id = 'rdf-proxy-middleware';

    config.settings.expressMiddleware = [
      ...config.settings.expressMiddleware,
      middleware,
    ];
  }
  return config;
};
