const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { format, parseISO, isValid, isBefore, addMinutes } = require('date-fns');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const db = new sqlite3.Database('./estetica.db');

// Initialize tables
const initializeDatabase = () => {
	db.serialize(() => {
		db.run(`CREATE TABLE IF NOT EXISTS services (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL,
			description TEXT,
			durationMinutes INTEGER NOT NULL,
			price REAL NOT NULL
		)`);

		db.run(`CREATE TABLE IF NOT EXISTS bookings (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			serviceId INTEGER NOT NULL,
			clientName TEXT NOT NULL,
			clientEmail TEXT NOT NULL,
			startsAt TEXT NOT NULL,
			endsAt TEXT NOT NULL,
			createdAt TEXT NOT NULL,
			FOREIGN KEY(serviceId) REFERENCES services(id)
		)`);

		// Seed default services if empty
		db.get('SELECT COUNT(*) as count FROM services', (err, row) => {
			if (err) return console.error(err);
			if (row.count === 0) {
				const stmt = db.prepare('INSERT INTO services (name, description, durationMinutes, price) VALUES (?, ?, ?, ?)');
				const defaultServices = [
					['Limpieza facial', 'Limpieza profunda y revitalización de la piel', 45, 35.0],
					['Manicura clásica', 'Cuidado de uñas con acabado impecable', 30, 20.0],
					['Pedicura spa', 'Relajación y tratamiento completo de pies', 50, 28.0],
					['Masaje relajante', 'Masaje corporal descontracturante', 60, 40.0],
				];
				for (const s of defaultServices) stmt.run(s);
				stmt.finalize();
			}
		});
	});
};

initializeDatabase();

// Helpers
const findOverlappingBooking = (startsAtISO, endsAtISO) => new Promise((resolve, reject) => {
	const query = `SELECT * FROM bookings WHERE NOT (endsAt <= ? OR startsAt >= ?)`;
	db.all(query, [startsAtISO, endsAtISO], (err, rows) => {
		if (err) return reject(err);
		resolve(rows);
	});
});

// Routes
app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.get('/api/services', (_req, res) => {
	db.all('SELECT * FROM services ORDER BY id ASC', (err, rows) => {
		if (err) return res.status(500).json({ error: 'Error al obtener servicios' });
		res.json(rows);
	});
});

app.post('/api/services', (req, res) => {
	const { name, description = '', durationMinutes, price } = req.body;
	if (!name || !durationMinutes || !price) {
		return res.status(400).json({ error: 'Faltan campos requeridos' });
	}
	db.run(
		'INSERT INTO services (name, description, durationMinutes, price) VALUES (?, ?, ?, ?)',
		[name, description, durationMinutes, price],
		function (err) {
			if (err) return res.status(500).json({ error: 'No se pudo crear el servicio' });
			res.status(201).json({ id: this.lastID, name, description, durationMinutes, price });
		}
	);
});

app.get('/api/bookings', (_req, res) => {
	db.all(
		`SELECT b.*, s.name as serviceName, s.durationMinutes, s.price FROM bookings b
		JOIN services s ON s.id = b.serviceId
		ORDER BY b.startsAt ASC`,
		(err, rows) => {
			if (err) return res.status(500).json({ error: 'Error al obtener reservas' });
			res.json(rows);
		}
	);
});

app.post('/api/bookings', async (req, res) => {
	try {
		const { serviceId, clientName, clientEmail, startsAt } = req.body;
		if (!serviceId || !clientName || !clientEmail || !startsAt) {
			return res.status(400).json({ error: 'Faltan campos requeridos' });
		}
		const parsedStart = parseISO(startsAt);
		if (!isValid(parsedStart)) {
			return res.status(400).json({ error: 'Fecha inválida' });
		}
		if (isBefore(parsedStart, new Date())) {
			return res.status(400).json({ error: 'La fecha debe ser futura' });
		}
		db.get('SELECT * FROM services WHERE id = ?', [serviceId], async (err, service) => {
			if (err || !service) return res.status(404).json({ error: 'Servicio no encontrado' });
			const endsAtISO = addMinutes(parsedStart, service.durationMinutes).toISOString();
			const startsAtISO = parsedStart.toISOString();
			const overlaps = await findOverlappingBooking(startsAtISO, endsAtISO);
			if (overlaps.length > 0) {
				return res.status(409).json({ error: 'Horario no disponible' });
			}
			db.run(
				'INSERT INTO bookings (serviceId, clientName, clientEmail, startsAt, endsAt, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
				[serviceId, clientName, clientEmail, startsAtISO, endsAtISO, new Date().toISOString()],
				function (insertErr) {
					if (insertErr) return res.status(500).json({ error: 'No se pudo crear la reserva' });
					res.status(201).json({ id: this.lastID });
				}
			);
		});
	} catch (error) {
		res.status(500).json({ error: 'Error inesperado' });
	}
});

app.delete('/api/bookings/:id', (req, res) => {
	const id = Number(req.params.id);
	if (Number.isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
	db.run('DELETE FROM bookings WHERE id = ?', [id], function (err) {
		if (err) return res.status(500).json({ error: 'No se pudo eliminar la reserva' });
		if (this.changes === 0) return res.status(404).json({ error: 'Reserva no encontrada' });
		res.json({ ok: true });
	});
});

app.listen(PORT, () => {
	console.log(`API escuchando en http://localhost:${PORT}`);
});