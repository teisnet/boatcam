'use strict';

const bcrypt = require('bcrypt');

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
		// TODO: Don't serialize password'
		// underscored: true,
		underscoredAll: true,
		classMethods: {
			associate: function(models) {
				User.belongsToMany(models.Berth, { through: models.BerthUser, as: 'berths', foreignKey: 'user_id' });
			}
		},

		instanceMethods: {
			validPassword: function(pw, cb) {
				let password = this.getDataValue('password');
				if (pw === password) { return cb(null, true); }

				bcrypt.compare(pw, password, function(err, isEqual) {
					if(err) {
						return cb(err);
					}
					cb(null, isEqual);
				});
			}
		},

		getterMethods: {
			name: function () {
				let firstname = this.getDataValue('firstname');
				let lastname = this.getDataValue('lastname');
				return (firstname || '') + (lastname && (' ' + lastname) || '');
			}
		},

		hooks: {
			// Consider beforeCreate hook for password
			afterValidate: function(user, options, cb) {
				if(user.changed('password') /*|| user.isNewRecord*/) {
					bcrypt.genSalt(10, function(err, salt) {
						if(err) {
							return cb(err);
						}
						let password = user.getDataValue('password');
						bcrypt.hash(password, salt, function(err, hash) {
							if(err) {
								return cb(err);
							}
							user.password = hash;
							cb(null);
						});
					});
				} else {
					return cb(null);
				}
			}
		}

	});

	return User;
};
