var bcrypt = require('bcrypt');
const saltRounds = 10;
var hash = bcrypt.hashSync('click', bcrypt.genSaltSync(saltRounds));

var data = [
	{
		'model': 'Users',
		'documents': [
			{
				'name': 'david',
				'password': hash,
				'active': true,
				'slug': 'admin',
				'email': 'david@test.com',
				'upload_folder_name': 'david',
				'roles': {
					'name': 'Admin'
				},
				'modules': [{
					'name': 'admin.artists'
				},{
					'name': 'admin.dashboard'
				},{
					'name': 'admin.music'
				},{
					'name': 'admin.pages'
				},{
					'name': 'admin.social'
				}]
			},
			{
				'name': 'leo',
				'password': hash,
				'active': true,
				'slug': 'leo',
				'email': 'leo@test.com',
				'upload_folder_name': 'leo',
				'roles': {
					'name': 'Admin'
				},
				'modules': [{
					'name': 'admin.artists'
				},{
					'name': 'admin.dashboard'
				},{
					'name': 'admin.music'
				},{
					'name': 'admin.pages'
				},{
					'name': 'admin.blog'
				},{
					'name': 'admin.social'
				}]
			},
			{
				'name': 'artist1',
				'password': hash,
				'active': true,
				'slug': 'artist1',
				'email': 'artist1@test.com',
				'upload_folder_name': 'artist1',
				'upload_bio_folder': 'artist1/bio',
				'roles': {
					'name': 'Artist'
				},
				'modules': [{
					'name': 'admin.bio'
				},{
					'name': 'admin.events'
				},{
					'name': 'admin.gallery'
				},{
					'name': 'admin.dashboard'
				},{
					'name': 'admin.social'
				}]

			},
			{
				'name': 'artist2',
				'password': hash,
				'active': true,
				'slug': 'artist2',
				'email': 'artist2@test.com',
				'upload_folder_name': 'artist2',
				'upload_bio_folder': 'artist2/bio',
				'roles': {
					'name': 'Artist'
				},
				'modules': [{
					'name': 'admin.bio'
				},{
					'name': 'admin.events'
				},{
					'name': 'admin.gallery'
				},{
					'name': 'admin.dashboard'
				},{
					'name': 'admin.social'
				}]
			},
			{
				'name': 'artist3',
				'password': hash,
				'active': false,
				'slug': 'artist3',
				'email': 'artist3@test.com',
				'upload_folder_name': 'artist3',
				'upload_bio_folder': 'artist3/bio',
				'roles': {
					'name': 'Artist'
				},
				'modules': [{
					'name': 'admin.bio'
				},{
					'name': 'admin.events'
				},{
					'name': 'admin.gallery'
				},{
					'name': 'admin.dashboard'
				},{
					'name': 'admin.social'
				}]
			},
			{
				'name': 'artist4',
				'password': hash,
				'active': false,
				'slug': 'artist4',
				'email': 'artist4@test.com',
				'upload_folder_name': 'artist4',
				'upload_bio_folder': 'artist1/bio',
				'roles': {
					'name': 'Artist'
				},
				'modules': [{
					'name': 'admin.bio'
				},{
					'name': 'admin.events'
				},{
					'name': 'admin.gallery'
				},{
					'name': 'admin.dashboard'
				},{
					'name': 'admin.social'
				}]
			}
		]
	}
];

module.exports = data;

