const plugins = (defaultPlugins) => {
  return defaultPlugins; // .concat(['scss']);
};
const modify = (config, { target, dev }, webpack) => {
  config.resolve.alias[
    '../../theme.config$'
  ] = `${__dirname}/theme/theme.config`;

  return config;
};

module.exports = {
  plugins,
  modify,
};
