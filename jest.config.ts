/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
	// All imported modules in your tests should be mocked automatically
	// automock: false,

	// Stop running tests after `n` failures
	// bail: 0,

	// The directory where Jest should store its cached dependency information
	// cacheDirectory: "/private/var/folders/35/4k90_5c16cj9kxg9knbhj9g40000gn/T/jest_dx",

	// Automatically clear mock calls, instances, contexts and results before every test
	// clearMocks: false,

	// Indicates whether the coverage information should be collected while executing the test
	collectCoverage : true,

	// An array of glob patterns indicating a set of files for which coverage information should be collected
	// collectCoverageFrom: undefined,

	// The directory where Jest should output its coverage files
	coverageDirectory : "coverage",

	// An array of regexp pattern strings used to skip coverage collection
	// coveragePathIgnorePatterns: [
	//   "/node_modules/"
	// ],

	// Indicates which provider should be used to instrument code for coverage
	coverageProvider : "v8",

	// A list of reporter names that Jest uses when writing coverage reports
	// coverageReporters: [
	//   "json",
	//   "text",
	//   "lcov",
	//   "clover"
	// ],

	// An object that configures minimum threshold enforcement for coverage results
	// coverageThreshold: undefined,

	// A path to a custom dependency extractor
	// dependencyExtractor: undefined,

	// Make calling deprecated APIs throw helpful error messages
	// errorOnDeprecated: false,

	// The default configuration for fake timers
	// fakeTimers: {
	//   "enableGlobally": false
	// },

	// Force coverage collection from ignored files using an array of glob patterns
	// forceCoverageMatch: [],

	// A path to a module which exports an async function that is triggered once before all test suites
	// globalSetup: undefined,

	// A path to a module which exports an async function that is triggered once after all test suites
	// globalTeardown: undefined,

	// A set of global variables that need to be available in all test environments
	// globals: {},

	// The maximum amount of workers used to run your tests. Can be specified as % or a number. E.g. maxWorkers: 10% will use 10% of your CPU amount + 1 as the maximum worker number. maxWorkers: 2 will use a maximum of 2 workers.
	maxWorkers: 1,	//"50%",
	maxConcurrency: 1,
	// sequential: true,	//	Enable sequential execution of test cases

	// An array of directory names t