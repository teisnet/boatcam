'use strict';

module.exports = function(sequelize, DataTypes) {
	const ProjectUser = sequelize.define('CameraPosition', {
		x: DataTypes.REAL,
		y: DataTypes.REAL,
		zoom: DataTypes.REAL
	}, {
		//tableName: 'project_users',
		timestamps: false,
		// underscored: true,
		underscoredAll: true,
		// comment: 'I'm a table comment!'
		classMethods: {
			/*getProjectUsers: function(projectname) {
				return sequelize.query(queries.getProjectUsers, {
					bind: { projectname: projectname },
					type: sequelize.QueryTypes.SELECT
					// model: ProjectUser
				});
			},

			getUserProjects: function(username) {
				return sequelize.query(queries.getUserProjects, {
					bind: { username: username },
					type: sequelize.QueryTypes.SELECT
					// model: ProjectUser
				});
			},*/

			updateByName: function(bindParams) {
				return sequelize.query(queries.editUserProject, {
					bind: bindParams,
					type: sequelize.QueryTypes.UPDATE
				});
			},

			removeByName: function(bindParams) {
				return sequelize.query(queries.removeUserProject, {
					bind: bindParams,
					type: sequelize.QueryTypes.DELETE
				});
			},

			createByName: function(bindParams) {
				return sequelize.query(queries.addUserProject, {
					bind: bindParams,
					type: sequelize.QueryTypes.INSERT
				});
			}
		}
	});

	return ProjectUser;
};

const queries = {};
/*
queries.getUserProjects = `
SELECT projects.name, project_users.status, COALESCE(project_users.related, false) AS related
FROM projects
	LEFT JOIN
	(
		SELECT project_users.project_id, project_users.status, true AS related FROM project_users
		INNER JOIN users
		ON project_users.user_id = users.id AND users.name = $username::varchar

	) AS project_users
	ON projects.id = project_users.project_id
`.replace(/\s+/g, ' ');

queries.getProjectUsers = `
SELECT users.name, project_users.status, COALESCE(project_users.related, false) AS related
FROM users
	LEFT JOIN
	(
		SELECT project_users.user_id, project_users.status, true AS related FROM project_users
		INNER JOIN projects
		ON project_users.project_id = projects.id AND projects.name = $projectname::varchar

	) AS project_users
	ON users.id = project_users.user_id
`.replace(/\s+/g, ' ');
*/

queries.addUserProject = `
INSERT INTO project_users (project_id, user_id, status)
SELECT p.id, u.id, $status::enum_project_users_status
FROM
(
	SELECT id
	FROM projects
	WHERE name = $projectname::varchar
) AS p
CROSS JOIN
(
	SELECT id
	FROM users
	WHERE name = $username::varchar
) AS u
`.replace(/\s+/g, ' ');

queries.editUserProject = `
UPDATE project_users
SET status = $status::enum_project_users_status
WHERE project_id IN
(
	SELECT id AS project_id
	FROM projects
	WHERE name = $projectname::varchar
)
AND user_id IN
(
	SELECT id AS user_id
	FROM users
	WHERE name = $username::varchar
)
`.replace(/\s+/g, ' ');

queries.removeUserProject = `
DELETE
FROM project_users
WHERE project_id IN
(
	SELECT id AS project_id
	FROM projects
	WHERE name = $projectname::varchar
)
AND user_id IN
(
	SELECT id AS user_id
	FROM users
	WHERE name = $username::varchar
)
`.replace(/\s+/g, ' ');
