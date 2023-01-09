// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import { Shallow } from 'shallow-render';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

/**
 * Context builder for karma tests
 */
declare const require: {
  context(
    path: string,
    deep?: boolean,
    filter?: RegExp,
  ): {
    <T>(id: string): T;
    keys(): string[];
  };
};

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

Shallow.alwaysReplaceModule(RouterModule, RouterTestingModule);

// Then we find all the tests.
/** Context for searching for tests */
const context = require.context('../', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);
