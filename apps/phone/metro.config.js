const path = require('path');
const { getDefaultConfig } = require('@expo/metro-config');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [
  path.resolve(workspaceRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'packages', 'utils'),
  path.resolve(workspaceRoot, 'packages', 'cross'),
  path.resolve(workspaceRoot, 'ca', 'enterprise'),
  path.resolve(workspaceRoot, 'ca', 'application'),
  path.resolve(workspaceRoot, 'adapters', 'frontend'),
  path.resolve(workspaceRoot, 'frameworks-frontend', 'local'),
  path.resolve(workspaceRoot, 'frameworks-frontend', 'store'),
  path.resolve(workspaceRoot, 'frameworks-frontend', 'fish-api'),
  path.resolve(workspaceRoot, 'frameworks-frontend', 'offline-first'),
];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// config.resolver.disableHierarchicalLookup = true;

module.exports = config;
