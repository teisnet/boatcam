'use strict';

module.exports = function(sequelize, DataTypes) {
	const Berth = sequelize.define('Berth', {
		number: {
			type:  DataTypes.STRING,
			// trim: true,
			allowNull: false,
			unique : true,
			validate: {
				is: {
					args: /^[a-z0-9-_.]*$/i,
					msg: 'Value must only contain English characters and numbers'
				},
				not: {
					args: /^[0-9a-fA-F]{24}$/,
					msg: 'Value cannot be an ObjectId'
				}
			}
		},
		owner: DataTypes.STRING
	}, {
		// underscored: true,
		underscoredAll: true,
		classMethods: {
			associate: function(models) {
				Berth.belongsToMany(models.Camera, { through: models.CameraPosition, as: 'cameras', foreignKey: 'berth_id' });
				Berth.belongsToMany(models.User, { through: models.BerthUser, as: 'users', foreignKey: 'berth_id' });
			},

			getAllFlagUser: function(userId) {
				return sequelize.query(queries.getAllFlagUser, {
					bind: { userid: userId },
					type: sequelize.QueryTypes.SELECT
					// model: Berth
				});
			}
		}
	});

	return Berth;
};

const queries = {};
queries.getAllFlagUser = `
SELECT berths.id, berths.number, COALESCE(berth_users.related, false) AS related
FROM berths
LEFT JOIN
(
	SELECT berth_users.berth_id, berth_users.user_id, true AS related FROM berth_users
	WHERE berth_users.user_id = $userid::integer
) AS berth_users
ON berths.id = berth_users.berth_id
`.replace(/\s+/g, ' ');
