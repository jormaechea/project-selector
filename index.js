'use strict';

const fs = require('fs-extra');
const path = require('path');
const prompts = require('prompts');
const Fuse = require('fuse.js')

const BASE_PATH = '/var/www/';

const readProyects = () => {
	return fs.readdir(BASE_PATH);
};

const fuse = new Fuse([], {
	findAllMatches: true,
	threshold: 0.3,
	keys: ['title']
});


const promptProyects = proyects => {

	const proyectsChoices = proyects.map(proyect => ({ title: proyect, value: proyect }));

	return prompts([
		{
			type: 'autocomplete',
			name: 'proyect',
			message: 'Select a project (you can start typing)',
			choices: proyectsChoices,
			suggest: async (input, choices) => {

				fuse.setCollection(choices);
				return fuse.search(input)
					.map(({ item }) => item);
			}
		}
	], {
		onCancel: () => {
			console.log('Operation cancelled');
			process.exit(0);
		}
	})
};

const selectProyect = proyect => {
	fs.writeFileSync(path.resolve(__dirname, '.selected-proyect'), proyect);
};

(async () => {

	selectProyect('');

	const proyects = await readProyects();

	const { proyect } = await promptProyects(proyects);

	selectProyect(proyect)

})();