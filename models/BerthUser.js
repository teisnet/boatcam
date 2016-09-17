'use strict';

module.exports = function(sequelize, DataTypes) {
	const BerthUser = sequelize.define('BerthUser', {

	}, {
		timestamps: false,
		// underscored: true,
		underscoredAll: true,
		classMethods: {
			getBerthUsers: function(berthname) {
				return sequelize.query(queries.getBerthUsers, {
					bind: { berthname: berthname },
					type: sequelize.QueryTypes.SELECT
					// model: BerthUser
				});
			},

			getUserBerths: function(username) {
				return sequelize.query(queries.getUserBerths, {
					bind: { username: username },
					type: sequelize.QueryTypes.SELECT
					// model: BerthUser
				});
			},

			updateByName: function(bindParams) {
				return sequelize.query(queries.editUserBerth, {
					bind: bindParams,
					type: sequelize.QueryTypes.UPDATE
				});
			},

			removeByName: function(bindParams) {
				return sequelize.query(queries.removeUserBerth, {
					bind: bindParams,
					type: sequelize.QueryTypes.DELETE
				});
			},

			createByName: function(bindParams) {
				return sequelize.query(queries.addUserBerth, {
					bind: bindParams,
					type: sequelize.QueryTypes.INSERT
				});
			}
		}
	});

	return BerthUser;
};

const queries = {};

queries.getUserBerths = `
SELECT berths.name, berth_users.status, COALESCE(berth_users.related, false) AS related
FROM berths
	LEFT JOIN
	(
		SELECT berth_users.berth_id, berth_users.status, true AS related FROM berth_users
		INNER JOIN users
		ON berth_users.user_id = users.id AND users.name = $username::varchar

	) AS berth_users
	ON berths.id = berth_users.berth_id
`.replace(/\s+/g, ' ');

queries.getBerthUsers = `
SELECT users.name, berth_users.status, COALESCE(berth_users.related, false) AS related
FROM users
	LEFT JOIN
	(
		SELECT berth_users.user_id, berth_users.status, true AS related FROM berth_users
		INNER JOIN berths
		ON berth_users.berth_id = berths.id AND berths.name = $berthname::varchar

	) AS berth_users
	ON users.id = berth_users.user_id
`.replace(/\s+/g, ' ');

queries.addUserBerth = `
INSERT INTO berth_users (berth_id, user_id, status)
SELECT p.id, u.id, $status::enum_berth_users_status
FROM
(
	SELECT id
	FROM berths
	WHERE name = $berthname::varchar
) AS p
CROSS JOIN
(
	SELECT id
	FROM users
	WHERE name = $username::varchar
) AS u
`.replace(/\s+/g, ' ');

queries.editUserBerth = `
UPDATE berth_users
SET status = $status::enum_berth_users_status
WHERE berth_id IN
(
	SELECT id AS berth_id
	FROM berths
	WHERE name = $berthname::varchar
)
AND user_id IN
(
	SELECT id AS user_id
	FROM users
	WHERE name = $username::varchar
)
`.replace(/\s+/g, ' ');

queries.removeUserBerth = `
DELETE
FROM berth_users
WHERE berth_id IN
(
	SELECT id AS berth_id
	FROM berths
	WHERE name = $berthname::varchar
)
AND user_id IN
(
	SELECT id AS user_id
	FROM users
	WHERE name = $username::varchar
)
`.replace(/\s+/g, ' ');
