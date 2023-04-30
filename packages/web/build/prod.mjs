#!/usr/bin/env node

let startTime = Date.now()

import { appName, buildOptions } from './common.mjs'
import { build } from 'esbuild'
import chalk from 'chalk'

await build(buildOptions({ isProduction: true }))

let elapsedMs = Date.now() - startTime

console.log(
  chalk.green(`✅ Built ${appName()} in ${chalk.blue(`${elapsedMs}ms`)}`)
)
