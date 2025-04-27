CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    player_name VARCHAR(100) NOT NULL,
    position VARCHAR(10) NOT NULL,
    college VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL
);

CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    position_needs TEXT[]
);

CREATE TABLE draft_picks (
    id SERIAL PRIMARY KEY,
    pick_number INTEGER NOT NULL,
    round INTEGER NOT NULL,
    year INTEGER NOT NULL,
    current_team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
    original_team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
    player_id INTEGER NULL REFERENCES players(id) ON DELETE CASCADE
);