--Seed - dane startowe, wrzucane do bazy przy pierwszym uruchomieniu kontenera
--to nie schema (struktura), tylko przykładowe rekordy żeby baza nie była pusta

--Oferty pracy - te same 4 co w tablicy jobs[] w script.js
INSERT INTO job_offers (title, company, tags, match_score) VALUES
    ('Frontend Developer', 'SoftLine', ARRAY['HTML', 'CSS', 'JavaScript'], 92),
    ('Junior Web Developer', 'CodeWorks', ARRAY['HTML', 'CSS', 'Git'], 84),
    ('UI Developer', 'DesignHub', ARRAY['CSS', 'RWD', 'JavaScript'], 78),
    ('Web Support Specialist', 'TechCare', ARRAY['HTML', 'Helpdesk', 'CSS'], 69);

--Użytkownik testowy - login: demo, haslo: demo123 (backend i tak powinien to zahashować)
INSERT INTO users (login, password_hash) VALUES
    ('demo', 'demo123');

--Przykładowe cv dla usera demo (user_id = 1, bo to pierwszy user w bazie)
INSERT INTO cvs (user_id, name, position, skills, description) VALUES
    (
        1,
        'Front-End Junior',
        'Frontend Developer',
        'HTML, CSS, JavaScript',
        'Student z podstawowym doświadczeniem w projektach webowych.'
    );

--Przykładowe notatki dla usera demo
INSERT INTO notes (user_id, text) VALUES
    (1, 'Przygotować portfolio na GitHubie.'),
    (1, 'Powtórzyć flexbox i grid przed rozmową.');

--Demo user zaakceptował ofertę nr 1 (Frontend Developer / SoftLine)
INSERT INTO matches (user_id, job_id) VALUES
    (1, 1);
