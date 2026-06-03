CREATE TABLE nutrientapplogs(
    logid SERIAL PRIMARY KEY,
    userid INTEGER,
    nutrientdata JSONB,
    logdate timestamp,
    title text,
    imagetype text,
    imagedata text
)
CREATE TABLE nutrientappusers(
    id SERIAL PRIMARY KEY,
    email text,
    password text,
    registereddate timestamp,
    username text
)