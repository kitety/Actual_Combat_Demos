// @ts-nocheck
import React from 'react';
import { ApplyPluginsType } from 'c:/Users/kitety/Documents/my/Actual_Combat_Demos/15-umi3/node_modules/@umijs/preset-built-in/node_modules/@umijs/runtime';
import * as umiExports from './umiExports';
import { plugin } from './plugin';

export function getRoutes() {
  const routes = [
  {
    "path": "/",
    "exact": true,
    "component": require('@/pages/index.js').default
  },
  {
    "path": "/profile",
    "exact": true,
    "component": require('@/pages/profile.js').default
  },
  {
    "path": "/user",
    "routes": [
      {
        "path": "/user/add",
        "exact": true,
        "component": require('@/pages/user/add.js').default
      },
      {
        "path": "/user/list",
        "exact": true,
        "component": require('@/pages/user/list.js').default
      }
    ],
    "component": require('@/pages/user/_layout.js').default
  }
];

  // allow user to extend routes
  plugin.applyPlugins({
    key: 'patchRoutes',
    type: ApplyPluginsType.event,
    args: { routes },
  });

  return routes;
}
