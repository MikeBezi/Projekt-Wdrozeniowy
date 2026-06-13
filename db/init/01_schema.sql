--Tworzenie users - każdy użytkownik ma id(primary key), login(unique), password_hash, created_at
--id każdy użytkownik ma unikalny - tworzony automatycznie przez serwer
--login - nie może być duplikatów
--password_hash - hasło jest hashowane przez backend
--created_at - data utworzenia użytkownika
CREATE TABLE users (
    id            SERIAL PRIMARY KEY,
    login         VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

--Tworzenie cvs - każde cv ma id(primary key), user_id(foreign key do users), name, position, skills, description, updated_at
--id - tworzony automatycznie przez serwer
--user_id - foreign key(połączenie) do users
--name - nazwa cv
--position - stanowisko z formularza (pole cvPosition, np. Frontend Developer)
--skills - umiejętności użytkownika
--description - opis użytkownika
--updated_at - data aktualizacji cv
CREATE TABLE cvs (
    id          BIGSERIAL PRIMARY KEY,
    user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name        VARCHAR(200) NOT NULL,
    position    VARCHAR(200) NOT NULL,
    skills      TEXT,
    description TEXT,
    updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

--Tworzenie notes - każda nota ma id(primary key), user_id(foreign key do users), text, created_at
--id - tworzony automatycznie przez serwer
--user_id - foreign key(połączenie) do users
--text - treść notatki
--created_at - data utworzenia notatki
CREATE TABLE notes (
    id         BIGSERIAL PRIMARY KEY,
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    text       TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

--Tworzenie job_offers - każda oferta ma id(primary key), title, company, tags, match_score
--id - tworzony automatycznie przez serwer
--title - tytuł oferty pracy
--company - nazwa firmy
--tags - tagi/technologie przy ofercie
--match_score - procent dopasowania
CREATE TABLE job_offers (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(200) NOT NULL,
    company     VARCHAR(200) NOT NULL,
    tags        TEXT[] NOT NULL DEFAULT '{}',
    match_score INTEGER NOT NULL CHECK (match_score BETWEEN 0 AND 100)
);

--Tworzenie matches - każde dopasowanie ma id(primary key), user_id(foreign key do users), job_id(foreign key do job_offers), matched_at, unique(user_id, job_id)
--id - tworzony automatycznie przez serwer
--user_id - foreign key(połączenie) do users
--job_id - foreign key(połączenie) do job_offers
--matched_at - data kliknięcia Dopasuj
--unique(user_id, job_id) - ten sam user nie może dopasować tej samej oferty dwa razy
CREATE TABLE matches (
    id         BIGSERIAL PRIMARY KEY,
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id     INTEGER NOT NULL REFERENCES job_offers(id) ON DELETE CASCADE,
    matched_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, job_id)
);

--Tworzenie indeksów - idx_cvs_user_id, idx_notes_user_id, idx_matches_user_id, idx_matches_job_id
--nie wiem czy to jest potrzebne, ale lepiej jest to zrobić (jak co, można to usunąć)
CREATE INDEX idx_cvs_user_id ON cvs(user_id);
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_matches_user_id ON matches(user_id);
CREATE INDEX idx_matches_job_id ON matches(job_id);
