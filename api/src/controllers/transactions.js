import Users from "../models/userModel";
import Transactions from "../models/transactionsModel.js";
import Categories from "../models/categoriesModel.js";

export const getTransactions = async (req, res) => {
    try{
        const where = { user_id: req.userId };
        if (req.query.type){
            const validTypes = ["Pemasukan", "Pengeluaran"];
            if (!validTypes.includes(req.query.type)) {
                return res.status(400).json({ message: "Tipe transaksi tidak valid" });
            }
            where.type = req.query.type;
        }
        const transactions = await Transactions.findAll({ 
            where,
            attributes: ["transaction_name", "amount", "description", "type", "transaction_date"],
            include: [
                {
                    model: Users,
                    attributes: ["name"],
                },
                {
                    model: Categories,
                    attributes: ["name"],
                }
            ],
            raw: true,
         });
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createTransaction = async (req, res) => {
    const { transaction_name, amount, description, type, transaction_date } = req.body;
    try{
        await Transactions.create({
            transaction_name,
            amount,
            description,
            type,
            transaction_date,
            user_id: req.userId,
        });
        res.status(201).json({ message: "Transaksi berhasil ditambahkan" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateTransaction = async (req, res) => {
    const { transaction_name, amount, description, type, transaction_date } = req.body;
    const id = req.params.id;
    try{
        await Transactions.update(
            { transaction_name, amount, description, type, transaction_date },
            {
                where: {
                    id,
                    user_id: req.userId,
                }
            }
        );
        res.status(200).json({ message: "Transaksi berhasil diupdate" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteTransaction = async (req, res) => {
    const id = req.params.id;
    try{
        await Transactions.destroy({
            where: {
                id,
                user_id: req.userId,
            }
        });
        res.status(200).json({ message: "Transaksi berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getTransactionById = async (req, res) => {
    const id = req.params.id;
    try{
        const transaction = await Transactions.findOne({
            where: {
                id,
                user_id: req.userId,
            },
            attributes: ["transaction_name", "amount", "description", "type", "transaction_date"],
            include: [
                {
                    model: Users,
                    attributes: ["name"],
                },
                {
                    model: Categories,
                    attributes: ["name"],
                }
            ],
            raw: true,
         });
        if (!transaction) return res.status(404).json({ message: "Transaksi tidak ditemukan" });
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}