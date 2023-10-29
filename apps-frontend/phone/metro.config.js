/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const { getDefaultConfig } = require('@expo/metro-config');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [
  path.resolve(workspaceRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'packages', 'utils'),
  path.resolve(workspaceRoot, 'packages', 'cross'),

  path.resolve(workspaceRoot, 'packages-share', 'core'),

  path.resolve(workspaceRoot, 'packages-frontend', 'data-fetch'),
  path.resolve(workspaceRoot, 'packages-frontend', 'fish-api'),
  path.resolve(workspaceRoot, 'packages-frontend', 'local'),
  path.resolve(workspaceRoot, 'packages-frontend', 'store'),
  path.resolve(workspaceRoot, 'packages-frontend', 'subscription'),
];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// config.resolver.disableHierarchicalLookup = true;

module.exports = config;
