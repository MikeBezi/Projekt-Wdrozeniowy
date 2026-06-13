# Projekt-Wdrozeniowy

Projekt wdrożeniowy na zaliczenie studiów.

## Początek

### Konfiguracja GitHuba

1. Sklonuj repozytorium:

   ```bash
   git clone https://github.com/MikeBezi/Projekt-Wdrozeniowy.git
   ```

2. Wyślij swój nick na to dodam do projektu.

3. Utwórz własną gałąź (`branch`) i pracuj na niej, np:

   ```bash
   git checkout -b twoj-nick
   ```

---

## Instrukcja uruchomienia

1. Otwórz terminal w katalogu, w którym znajduje się projekt.

   Przy pierwszym uruchomieniu wykonaj polecenie:

   ```bash
   npm install express
   ```

2. Uruchom aplikację:

   ```bash
   node server.js
   ```

3. Otwórz przeglądarkę i przejdź pod adres:

   [http://localhost:3000](http://localhost:3000)

4. `Ctrl + C` w terminalu zatrzymuje serwer.

5. Wszystkie dane zapisują się w folderze `data` (frontend + backup plikowy).

---

## Baza danych (PostgreSQL + Docker)

Warstwa DB jest oddzielona od frontendu. Backend łączy się z PostgreSQL po connection stringu.

### Wymagania

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (uruchomiony)

### Pierwsze uruchomienie

1. Skopiuj plik konfiguracyjny:

   ```bash
   copy .env.example .env
   ```

2. Uruchom kontener z bazą:

   ```bash
   docker compose up -d
   ```

3. Sprawdź, czy baza działa:

   ```bash
   docker compose ps
   ```

   Status powinien być `healthy`.

### Połączenie (dla backendu)

| Parametr | Wartość (domyślna z `.env.example`) |
|----------|---------------------------------------|
| Host     | `localhost` (z komputera) / `postgres` (z kontenera) |
| Port     | `5432` |
| Baza     | `projekt_wdrozeniowy` |
| User     | `projekt_app` |
| Hasło    | `projekt_pass` |

Connection string:

```
postgresql://projekt_app:projekt_pass@localhost:5432/projekt_wdrozeniowy
```

### Schemat tabel

| Tabela | Opis |
|--------|------|
| `users` | konta użytkowników |
| `cvs` | zapisane CV |
| `notes` | notatki |
| `job_offers` | oferty pracy |
| `matches` | zaakceptowane dopasowania |

Pliki SQL: `db/init/01_schema.sql`, `db/init/02_seed.sql` — wykonują się **automatycznie** przy pierwszym starcie kontenera.

### Przydatne komendy

```bash
# logi bazy
docker compose logs -f postgres

# wejście do psql w kontenerze
docker compose exec postgres psql -U projekt_app -d projekt_wdrozeniowy

# zatrzymanie
docker compose down

# zatrzymanie + usunięcie danych (schema i seed załadują się od nowa)
docker compose down -v
```