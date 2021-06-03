'use strict';

const fs = require('fs-extra');
const path = require('path');
const prompts = require('prompts');

const BASE_PATH = '/var/www/';

const readProyects = () => {
	return fs.readdir(BASE_PATH);
};

const promptProyects = proyects => {

	const proyectsChoices = proyects.map(proyect => ({ title: proyect, value: proyect }));

	return prompts([
		{
			type: 'autocomplete',
			name: 'proyect',
			message: 'Select a project (you can start typing)',
			choices: proyectsChoices,
			suggest: (input, choices) => {
				const matcher = new RegExp(input, 'i');
				return Promise.resolve(choices.filter(({ title }) => title.match(matcher)));
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