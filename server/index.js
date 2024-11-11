import express from 'express';
import cors from 'cors';
import pkg from 'pg';

const port = 3001;
const { Pool } = pkg;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'todo',
    password: 'admin',
    port: 5432
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// GET all tasks
app.get('/', (req, res) => {
    pool.query('SELECT * FROM task', (error, result) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(200).json(result.rows);
    });
});

// POST a new task
app.post('/create', (req, res) => {
    const { description } = req.body;
    
    if (!description) {
        return res.status(400).json({ error: 'Description is required' });
    }

    pool.query(
        'INSERT INTO task (description) VALUES ($1) RETURNING *',
        [description],
        (error, result) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            }
            return res.status(200).json(result.rows[0]); // Return the created task object
        }
    );
});

// DELETE a task by ID
app.delete('/delete/:id', (req, res) => {
    const id = parseInt(req.params.id);
    pool.query('DELETE FROM task WHERE id = $1', [id], (error, result) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        return res.status(200).json({ message: 'Task deleted successfully' });
    });
});



app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
