'use strict';

const fs = require('fs-extra');
const path = require('path');
const prompts = require('prompts');
const Fuse = require('fuse.js')

const BASE_PATH = '/var/www/';

const readProjects = async () => {
	const content = await fs.readdir(BASE_PATH, { withFileTypes: true });
    return content.filter(project => project.isDirectory())
    	.map(project => project.name)
}

const fuse = new Fuse([], {
	findAllMatches: true,
	threshold: 0.3,
	keys: ['title']
});

const promptProjects = projects => {

	const projectsChoices = projects.map(project => ({ title: project, value: project }));

	return prompts([
		{
			type: 'autocomplete',
			name: 'project',
			message: 'Select a project (you can start typing)',
			choices: projectsChoices,
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

const selectProject = project => {
	fs.writeFileSync(path.resolve(__dirname, '.selected-project'), project);
};

(async () => {

	selectProject('');

	const projects = await readProjects();

	const { project } = await promptProjects(projects);

	selectProject(project)

})();