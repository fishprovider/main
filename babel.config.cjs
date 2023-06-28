// Plugins run before Presets
// Plugin ordering is first to last
// Preset ordering is reversed (last to first)

module.exports = (api) => {
  api.cache(true);
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: 'defaults',
        },
      ],
      [
        '@babel/preset-react',
        {
          runtime: 'automatic',
        },
      ],
      '@babel/preset-typescript',
    ],
  };
};
