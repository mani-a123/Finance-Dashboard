// backend/src/controllers/predictionController.js
import pool from '../config/db.js';

export const predictExpenses = async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch user's past transactions
        const transactions = await pool.query(
            "SELECT amount, type, txn_date FROM transactions WHERE user_id = $1 ORDER BY txn_date DESC LIMIT 12",
            [userId]
        );

        if (transactions.rows.length === 0) {
            return res.json({ prediction: 0, message: "No transactions found" });
        }

        // Simple prediction: average monthly expenses
        const expenses = transactions.rows.filter(t => t.type === "expense");
        const total = expenses.reduce((sum, t) => sum + parseFloat(t.amount), 0);
        const avg = (total / (expenses.length || 1)).toFixed(2);

        res.json({ prediction: avg });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error generating prediction" });
    }
};
