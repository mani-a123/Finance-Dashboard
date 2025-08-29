import pool from '../config/db.js';

// Monthly net totals (income - expense)
export async function getSummary(req, res) {
  try {
    const result = await pool.query(
      `SELECT date_trunc('month', txn_date) AS month,
              SUM(CASE WHEN type='income' THEN amount ELSE -amount END) AS net
       FROM transactions
       WHERE user_id=$1
       GROUP BY month
       ORDER BY month`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Breakdown by category
export async function getCategoryBreakdown(req, res) {
  try {
    const result = await pool.query(
      `SELECT category, SUM(amount) AS total
       FROM transactions
       WHERE user_id=$1
       GROUP BY category
       ORDER BY total DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
