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
  path.resolve(workspaceRoot, 'packages', 'enterprise-rules'),
  path.resolve(workspaceRoot, 'packages', 'application-rules'),
  path.resolve(workspaceRoot, 'adapters', 'frontend'),
  path.resolve(workspaceRoot, 'frameworks', 'offline-first'),
  path.resolve(workspaceRoot, 'frameworks', 'fish-api'),
  path.resolve(workspaceRoot, 'frameworks', 'local'),
  path.resolve(workspaceRoot, 'frameworks', 'store'),
];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// config.resolver.disableHierarchicalLookup = true;

module.exports = config;
