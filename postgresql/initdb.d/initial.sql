/**
 * USAGE:
 * psql -f db/initial.sql -U postgres
*/

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
	id uuid PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
	name TEXT NOT NULL UNIQUE,
	email VARCHAR(256) NOT NULL UNIQUE,
	passhash VARCHAR(256) NOT NULL
);

/**
 * uuid_generate_v1() → gen_random_uuid()
 * - UUIDv4にすることで一意性を保つため
 * - posted_atを作成したのでUUIDv1を使わずとも日付順のソートができるため
*/
CREATE TABLE posts (
	id uuid PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
	userid uuid NOT NULL,
	posted_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	text VARCHAR(280) NOT NULL,
	reply_to uuid
);

insert into users(name, email, passhash) values('user1', 'user1@sample.com', 'ABC');
insert into users(name, email, passhash) values('user2', 'user2@sample.com', 'ABC');
insert into users(name, email, passhash) values('user3', 'user3@sample.com', 'ABC');