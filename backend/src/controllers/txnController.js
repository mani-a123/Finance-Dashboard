import pool from '../config/db.js';

export async function createTransaction(req, res) {
  const { type, amount, category, payment_method, note, txn_date } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO transactions
       (user_id, type, amount, category, payment_method, note, txn_date)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [req.user.id, type, amount, category, payment_method, note, txn_date]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getTransactions(req, res) {
  try {
    const result = await pool.query(
      'SELECT * FROM transactions WHERE user_id=$1 ORDER BY txn_date DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateTransaction(req, res) {
  const { id } = req.params;
  const { type, amount, category, payment_method, note, txn_date } = req.body;
  try {
    const result = await pool.query(
      `UPDATE transactions
       SET type=$1, amount=$2, category=$3, payment_method=$4, note=$5, txn_date=$6
       WHERE id=$7 AND user_id=$8
       RETURNING *`,
      [type, amount, category, payment_method, note, txn_date, id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not-found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteTransaction(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM transactions WHERE id=$1 AND user_id=$2 RETURNING *',
      [id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
