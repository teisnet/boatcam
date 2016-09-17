'use strict';


module.exports = function(sequelize, DataTypes) {
	const User = sequelize.define('User', {
		firstname: DataTypes.STRING,
		lastname: DataTypes.STRING,
		username: DataTypes.STRING,
		password: DataTypes.STRING, //{ type: String, select: false },
		role: {
			type: DataTypes.ENUM('Administrator', 'Editor', 'User'),
			defaultValue: 'User'
		},
	}, {
		// underscored: true,
		underscoredAll: true,
		classMethods: {
			associate: function(models) {
				User.belongsToMany(models.Berth, { through: models.BerthUser, as: 'berths', foreignKey: 'user_id' });
			}
		},

		getterMethods: {
			name: function () {
				let firstname = this.getDataValue('firstname');
				let lastname = this.getDataValue('lastname');
				return (firstname || '') + (lastname && (' ' + lastname) || '');
			}
		},

	});

	return User;
};
