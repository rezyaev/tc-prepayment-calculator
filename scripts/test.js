/** @file Script for running unit tests */

import { promises as fs } from 'fs';
import path from 'path';

/**
 * Checks if the passed file is a test file using regular expression
 *
 * @param {string} fileName
 * @returns {boolean}
 */
const isTestFile = (fileName) => {
	const regex = /.+\.test\.js/;
	return regex.test(fileName);
};

/**
 * Scans directory for testing files recursively
 *
 * @param {string} directoryPath
 * @returns {Promise<string[]>}
 */
const getTestFilesPaths = async (directoryPath) => {
	const entries = await fs.readdir(directoryPath, {
		withFileTypes: true,
	});

	// Firstly, filter by test files and directories.
	// Then for each file return its path and for each directory
	// continue scanning recursively
	const testFilesPaths = entries
		.filter((entry) => isTestFile(entry.name) || entry.isDirectory())
		.map(async (entry) =>
			entry.isFile()
				? path.join(directoryPath, entry.name)
				: await getTestFilesPaths(path.join(directoryPath, entry.name))
		);

	// flatten resulting array because of recursion
	// (each function call returns array, so they return nested arrays)
	return (await Promise.all(testFilesPaths)).flat();
};

const main = async () => {
	// get paths of all test files, then dynamically import them
	const testFilesPaths = await getTestFilesPaths('./src');
	testFilesPaths.forEach((filePath) => import(path.join('..', filePath)));
};

main();
