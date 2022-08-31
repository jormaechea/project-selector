'use strict';

const fs = require('fs-extra');
const path = require('path');
const prompts = require('prompts');

const BASE_PATH = '/var/www/';

const readProjects = async () => {
	const content = await fs.readdir(BASE_PATH, { withFileTypes: true });
    return content.filter(project => project.isDirectory())
    	.map(project => project.name)
}

const promptProjects = projects => {

	const projectsChoices = projects.map(project => ({ title: project, value: project }));

	return prompts([
		{
			type: 'autocomplete',
			name: 'project',
			message: 'Seleccioná el projecto que quieras',
			choices: projectsChoices,
			suggest: (input, choices) => {
				const matcher = new RegExp(input, 'i');
				return Promise.resolve(choices.filter(({ title }) => title.match(matcher)));
			}
		}
	])
};

const selectProject = project => {
	fs.writeFileSync(path.resolve(__dirname, '.selected-project'), project);
};

(async () => {

	selectProject('');

	const projects = await readProjects();

	const { project } = await promptProjects(projects);

	selectProject(project)

})();